# Django imports
from django.utils import timezone
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import transaction, connection
from django.db.models import Count
from django.db.models.functions import TruncDay
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

# Django REST Framework imports
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

# Local application imports
from .models import Inventory, MenuItem, Employee, Recipe, CustomerOrder, OrderItems
from .serializers import (
    InventorySerializer, MenuItemSerializer, EmployeeSerializer, RecipeSerializer,
    CustomerOrderSerializer, OrderItemsSerializer
)
from .utils import send_sms, normalize_phone_number, get_and_validate_dates, get_city_by_zip

# External imports
from phonenumber_field.phonenumber import to_python
from collections import defaultdict
from enum import Enum
import requests

# Project settings
from config.settings import OPEN_WEATHER_MAP_API_KEY



class InventoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows inventory to be viewed or edited.
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows menu items to be viewed or edited.
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employees to be viewed or edited.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows recipes to be viewed or edited.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class CustomerOrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customer orders to be viewed or edited.
    """
    queryset = CustomerOrder.objects.all()
    serializer_class = CustomerOrderSerializer

class OrderItemsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows order items to be viewed or edited.
    """
    queryset = OrderItems.objects.all()
    serializer_class = OrderItemsSerializer


class OrderStatus(Enum):
    """
    Enumeration for possible order statuses.
    
    Values:
    - INPROGRESS: Order is currently being processed.
    - COMPLETED: Order has been completed.
    - CANCELED: Order has been canceled.
    """
    INPROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELED = "Canceled"


@api_view(['POST'])
def register_user(request):
    """
    Registers a new user by taking a username and password.
    Returns a JSON Web Token (JWT) for authentication if registration is successful.
    
    Parameters:
    - username: A string representing the username (required).
    - password: A string representing the password (required).
    
    Returns:
    - JSON response containing the authentication token or error messages.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_201_CREATED)


class GroupedMenuItemsView(APIView):
    """
    Groups menu items by category and returns the grouped data.
    
    Returns:
    - A grouped list of menu items serialized data by their categories.
    """
    def get(self, request, *args, **kwargs):
        menu_items = MenuItem.objects.all()
        grouped_items = defaultdict(list)

        for item in menu_items:
            serializer = MenuItemSerializer(item, context={'request': request})
            grouped_items[item.category].append(serializer.data)

        return Response(grouped_items)


@api_view(['POST'])
def login_employee(request):
    """
    Authenticates an employee and returns a token for logged-in sessions.
    
    Parameters:
    - username: Employee's username.
    - password: Employee's password.
    
    Returns:
    - JSON response with token and user information if successful, or error message if not.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)

        return Response({"token": token.key,
                         "position": user.position,
                         "username": user.username,
                         "success": "Logged in successfully"})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_order(request):
    """
       Creates a new order, updates inventory, and optionally sends an SMS confirmation.

       Expects order details including menu items and quantities.

       Parameters:
       - order_items: List of dictionaries containing menu item IDs and quantities.
       - name: Customer's name.
       - phone_number: Customer's phone number.

       Returns:
       - Response indicating success or failure of the order creation.
    """
    order_items = request.data.get('order_items')
    order_name = request.data.get('name')
    phone_number = request.data.get('phone_number')
    normalized_phone_number = normalize_phone_number(phone_number)

    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        with transaction.atomic():
            newCustomerOrder = CustomerOrder(
                employee = request.user,
                status = OrderStatus.INPROGRESS.value,
                name = order_name,
                phone_number = phone_number,
                created_at = timezone.now()
            )
            newCustomerOrder.save()

            for item in order_items:
                menu_id = item['id']
                menu_quantity = item['quantity']

                inventory_items = Recipe.objects.filter(menu_item=menu_id).values_list('inventory_item', 'qty')
                for inv_item_id, qty_per_item in inventory_items:
                    required_quantity = qty_per_item * menu_quantity
                    inventory = Inventory.objects.select_for_update().get(id=inv_item_id)
                    if inventory.quantity < required_quantity:
                        raise ValueError(f"Not enough inventory for item ID {menu_id}")

                    inventory.quantity -= required_quantity
                    inventory.save()

                menu = get_object_or_404(MenuItem, id=menu_id)
                OrderItems.objects.create(
                    order=newCustomerOrder,
                    menu_item=menu,
                    quantity=menu_quantity
                )

            if normalized_phone_number:
                send_sms(normalized_phone_number, f"{newCustomerOrder.name}, your order has been successfully placed. We will be ready with your food shortly!")

        return Response({"message": "Order Success"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrdersPerDayView(APIView):
    """
    Returns the count of orders per day between specified start and end dates.
    
    Query Parameters:
    - start_date: Starting date of the period to calculate order count (format YYYY-MM-DD).
    - end_date: Ending date of the period to calculate order count (format YYYY-MM-DD).
    
    Returns:
    - A list of dates with order counts.
    """
    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "Both 'start_date' and 'end_date' query parameters are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        start_date = timezone.datetime.strptime(start_date, '%Y-%m-%d')
        end_date = timezone.datetime.strptime(end_date, '%Y-%m-%d')

        end_date += timezone.timedelta(days=1)

        orders_per_day = CustomerOrder.objects.filter(created_at__range=[start_date, end_date]) \
                          .annotate(date=TruncDay('created_at')) \
                          .values('date') \
                          .annotate(count=Count('id')) \
                          .values('date', 'count') \
                          .order_by('date')

        return Response(orders_per_day)


@api_view(['GET'])
def best_selling_combo(request):
    """
    Determines the best-selling combinations of menu items within a given time frame.
    
    Query Parameters:
    - start: Start date for the analysis period (YYYY-MM-DD).
    - end: End date for the analysis period (YYYY-MM-DD).
    
    Returns:
    - A JSON list of top combinations and their frequency of being ordered together.
    """
    start, end, error_response = get_and_validate_dates(request)
    if error_response:
        return error_response

    query = """
        SELECT aMenu.name as Menu_Item_1, bMenu.name as Menu_Item_2, COUNT(*) AS Times_Ordered_Together 
        FROM Order_Items a 
        JOIN Order_Items b ON a.Order_ID = b.Order_ID AND a.Menu_Item_ID < b.Menu_Item_ID 
        JOIN Menu_Item aMenu ON a.Menu_Item_ID = aMenu.ID 
        JOIN Menu_Item bMenu ON b.Menu_Item_ID = bMenu.ID 
        JOIN Customer_Order co ON co.ID = a.Order_ID 
        WHERE co.Created_At >= %s AND co.Created_At < %s 
        GROUP BY aMenu.name, bMenu.name 
        ORDER BY Times_Ordered_Together DESC 
        LIMIT 15;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [start, end])

        res = cursor.fetchall()

        formatted_result = []
        for row in res:
            formatted_result.append({
                "combo": row[0] + " and " + row[1],
                "count": row[2]
            })

    return Response(formatted_result, status=status.HTTP_200_OK)


@api_view(['GET'])
def sales_trend(request):
    """
    Analyzes and returns sales trends based on the quantity sold and total revenue generated by each menu item
    within a specified date range.

    Query Parameters:
    - start_date: The start date of the period for the sales analysis (YYYY-MM-DD).
    - end_date: The end date of the period for the sales analysis (YYYY-MM-DD).

    The endpoint expects 'start_date' and 'end_date' to be provided in the request's query parameters.
    It performs a SQL query to calculate the total quantity sold and total revenue for each menu item,
    ordering the results by the total quantity sold in descending order.

    Returns:
    - JSON response containing a list of menu items with their names, total quantities sold, and total revenue generated.
    - The response is ordered by the total quantity sold, from highest to lowest.
    - If date validation fails or necessary parameters are not provided, an appropriate error response is returned.
    """
    start, end, error_response = get_and_validate_dates(request)
    if error_response:
        return error_response

    query = """
        SELECT 
            mi.Name AS Menu_Item_Name,
            SUM(oi.Quantity) AS Total_Quantity_Sold,
            SUM(oi.Quantity * mi.Price) AS Total_Revenue
            FROM Order_Items oi
                JOIN Menu_Item mi ON oi.Menu_Item_ID = mi.ID
                JOIN Customer_Order co ON oi.Order_ID = co.ID
                WHERE co.Created_At >= %s AND co.Created_At < %s
                    GROUP BY mi.Name
                    ORDER BY Total_Quantity_Sold DESC;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [start, end])

        res = cursor.fetchall()

        formatted_result = []
        for row in res:
            formatted_result.append({
                "item_name": row[0],
                "total_quantity": row[1],
                "total_revenue": row[2]
            })

    return Response(formatted_result, status=status.HTTP_200_OK)


@api_view(['GET'])
def inventory_usage(request):
    """
    Reports the total inventory used within a specified date range, grouped by inventory item.
    
    Query Parameters:
    - start: Start date for the reporting period (YYYY-MM-DD).
    - end: End date for the reporting period (YYYY-MM-DD).
    
    Returns:
    - JSON list of inventory items and the total amount used.
    """
    start, end, error_response = get_and_validate_dates(request)
    if error_response:
        return error_response

    query = """
        SELECT i.Name, SUM(r.qty * oi.quantity) AS inventory_used 
            FROM Menu_Item mi 
            JOIN Order_Items oi ON mi.ID = oi.Menu_Item_ID 
            JOIN Customer_Order co ON co.ID = oi.Order_ID 
            JOIN Recipe r ON mi.ID = r.Menu_item 
            JOIN Inventory i ON r.Inventory_item = i.ID 
            WHERE co.Created_At >= %s AND co.Created_At < %s 
            GROUP BY i.Name 
            ORDER BY inventory_used DESC;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [start, end])

        res = cursor.fetchall()

        formatted_result = []
        for row in res:
            formatted_result.append({
                "inventory_name": row[0],
                "inventory_used": row[1],
            })

    return Response(formatted_result, status=status.HTTP_200_OK)


@api_view(['GET'])
def excess_report(request):
    """
    Reports the total inventory used within a specified date range, grouped by inventory item.
    
    Query Parameters:
    - start: Start date for the reporting period (YYYY-MM-DD).
    
    Returns:
    - JSON list of inventory items list of inventory items that sold less than 10% of their quantity between the timestamp and the current time, assuming no restocks have happened during the window.
    """
    start_date = request.query_params.get('start_date')

    start = timezone.datetime.strptime(start_date, '%Y-%m-%d')

    query = """
        SELECT * 
        FROM (
            SELECT 
                name, 
                MAX(can_make) AS can_make, 
                MAX(total_sold) AS total_sold, 
                CAST(MAX(total_sold) AS FLOAT) / (MAX(total_sold) + MAX(can_make)) AS relative_sold 
            FROM (
                SELECT 
                    mi.Name, 
                    MIN(i.quantity / r.qty) AS can_make, 
                    CASE 
                        WHEN mi.Name = a.Name THEN a.total_sold 
                        ELSE 0 
                    END AS total_sold 
                FROM (
                    SELECT 
                        mi.Name, 
                        0 AS can_make, 
                        SUM(oi.Quantity) AS total_sold 
                    FROM 
                        Menu_Item mi 
                        JOIN Order_Items oi ON mi.ID = oi.Menu_Item_ID 
                        JOIN Customer_Order co ON co.ID = oi.Order_ID 
                    WHERE 
                        Created_At >= %s
                    GROUP BY 
                        mi.Name 
                    ORDER BY 
                        mi.Name ASC
                ) a
                JOIN Menu_Item mi ON 1=1 
                JOIN Recipe r ON mi.ID = r.Menu_item 
                JOIN Inventory i ON r.Inventory_item = i.ID 
                GROUP BY 
                    mi.Name, 
                    a.Name, 
                    a.total_sold 
                ORDER BY 
                    mi.Name ASC
            ) magnusOpus 
            GROUP BY 
                name
        ) magnus2 
        WHERE 
            relative_sold <= 0.1 
        ORDER BY 
            relative_sold ASC;

    """

    with connection.cursor() as cursor:
        cursor.execute(query, [start])

        res = cursor.fetchall()

        formatted_result = []
        for row in res:
            formatted_result.append({
                "name": row[0],
                "can_make": row[1],
                "total_sold": row[2],
                "relative_sold": row[3],
            })

    return Response(formatted_result, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_weather(request):
    """
    Retrieves the current weather information for a given zip code using the OpenWeatherMap API.
    
    Query Parameters:
    - zip: The zip code for which weather data is requested.
    
    Returns:
    - JSON response containing weather data including temperature, description, and icon, or error message if failed.
    """
    zip_code = request.query_params.get('zip')
    city, error = get_city_by_zip(zip_code)
    if error:
        return JsonResponse({'error': error}, status=400)
    
    api_key = OPEN_WEATHER_MAP_API_KEY
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        weather_data = {
            'city': city,
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],
        }
        return JsonResponse(weather_data)
    else:
        return JsonResponse({'error': 'Could not retrieve weather data'}, status=500)


@api_view(['GET'])
def get_inventory(request):
    """
    Retrieves a list of all inventory items from the database.

    Returns:
    - JSON response containing all inventory items with their details serialized.
    """
    inventory = Inventory.objects.all()
   
    serializer = InventorySerializer(inventory, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def get_in_progress_orders(request):
    """
    Retrieves all customer orders that are currently in progress.

    Returns:
    - JSON response containing details of all in-progress orders, serialized for the client.
    """
    orders = CustomerOrder.objects.filter(status=OrderStatus.INPROGRESS.value)

    serializer = CustomerOrderSerializer(orders, many=True, context={'request': request})

    return Response(serializer.data)


@api_view(['PATCH'])
def update_order_status(request):
    """
    Updates the status of an existing order and optionally sends an SMS to the customer.

    Query Parameters:
    - status: The new status for the order ('complete', 'cancel', 'inprogress').
    - id: The ID of the order to update.

    Returns:
    - Response indicating the outcome of the status update or error message if failed.
    """
    order_status = request.query_params.get('status')
    order_id = request.query_params.get('id')
    if order_status == "complete":
        order_status = OrderStatus.COMPLETED.value
        message = "Your order has been completed."
    elif order_status == "cancel":
        order_status = OrderStatus.CANCELED.value
        message = "Your order has been canceled."
    elif order_status == "inprogress":
        order_status = OrderStatus.INPROGRESS.value
        message = "Your order is in progress."
    else:
        return Response({"error": "Invalid order status"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            order = CustomerOrder.objects.select_for_update().get(id=order_id)
            order.status = order_status
            order.save()

            phone_number = to_python(order.phone_number)
            if phone_number and phone_number.is_valid():
                normalized_phone_number = phone_number.as_e164
                send_sms(normalized_phone_number, f"{order.name}, {message}")
            else:
                print("Invalid phone number for order", order.id)

        return Response({"status": "Update successful"}, status=status.HTTP_200_OK)
    except CustomerOrder.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


from django.contrib.auth import get_user_model


@api_view(['POST'])
def google_token_exchange(request):
    """
    Exchanges a Google ID token for user data, authenticating or linking a user account.

    Parameters:
    - credential: The Google ID token.
    - clientId: The OAuth2 client ID that the ID token is intended for.

    Returns:
    - JSON response containing user information and a token, or an error if the token is invalid.
    """
    token = request.data.get('credential')
    if not token:
        return Response({"error": "Token not provided"}, status=400)

    params = {
        'id_token': token,
        'audience': request.data.get('clientId')
    }
    response = requests.get('https://oauth2.googleapis.com/tokeninfo', params=params)
    if response.status_code != 200:
        return Response({"error": "Invalid token"}, status=400)

    token_info = response.json()
    print(token_info)
    email = token_info.get('email')

    if not email:
        return Response({"error": "Token does not contain an email address"}, status=400)

    User = get_user_model()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "No existing user found with this email"}, status=404)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "user_id": user.id,
        "username": user.username,
        "position": user.position,
        "email": email
    })