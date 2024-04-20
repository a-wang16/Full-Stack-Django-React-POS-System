from rest_framework import viewsets
from .models import Inventory, MenuItem, Employee, Recipe, CustomerOrder, OrderItems
from .serializers import (InventorySerializer, MenuItemSerializer,
                          EmployeeSerializer, RecipeSerializer, CustomerOrderSerializer, OrderItemsSerializer)

from django.utils import timezone
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from collections import defaultdict
from rest_framework.views import APIView
from django.db import transaction, connection
from django.db.models.functions import TruncDay
from django.db.models import Count

from .serializers import MenuItemSerializer

from config.settings import OPEN_WEATHER_MAP_API_KEY
import requests

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class CustomerOrderViewSet(viewsets.ModelViewSet):
    queryset = CustomerOrder.objects.all()
    serializer_class = CustomerOrderSerializer

class OrderItemsViewSet(viewsets.ModelViewSet):
    queryset = OrderItems.objects.all()
    serializer_class = OrderItemsSerializer




@api_view(['POST'])
def register_user(request):
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
    def get(self, request, *args, **kwargs):
        menu_items = MenuItem.objects.all()
        grouped_items = defaultdict(list)

        for item in menu_items:
            serializer = MenuItemSerializer(item, context={'request': request})
            grouped_items[item.category].append(serializer.data)

        return Response(grouped_items)

@api_view(['POST'])
def login_employee(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "success": "Logged in successfully"})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def create_order(request):

    order_items = request.data.get('order_items')
    order_name = request.data.get('name')
    employee_name = request.user

    with transaction.atomic():
        # add new customer order
        employee = Employee.objects.get(username=employee_name)
        
        newCustomerOrder = CustomerOrder(
            employee = employee,
            status = "completed",
            name = order_name,
            created_at = timezone.now()
        )
        newCustomerOrder.save()
        
        for item in order_items:
            # update inventory
            menu_id = item['id']
            menu_quantity = item['quantity']

            inventory_items = list(Recipe.objects.filter(menu_item=menu_id).values_list('inventory_item', 'qty'))
            parsed_inventory_items = [{'inventoryId': inv_item[0], 'quantity': inv_item[1] * menu_quantity} for inv_item
                                      in inventory_items]

            for inv_item in parsed_inventory_items:
                inventory_id = inv_item['inventoryId']
                required_quantity = inv_item['quantity']

                inventory = Inventory.objects.select_for_update().get(id=inventory_id)
                if inventory.quantity < required_quantity:
                    return Response({"error": "Not enough items in inventory for item ID " + str(menu_id)},
                                    status=status.HTTP_400_BAD_REQUEST)

                inventory.quantity -= required_quantity
                inventory.save()

            # add new order items
            menu = MenuItem.objects.get(id = menu_id)

            newOrder = OrderItems(
                order = newCustomerOrder,
                menu_item = menu,
                quantity = menu_quantity
            )
            newOrder.save()

    return Response({"message": "Order Success"}, status=status.HTTP_201_CREATED)


class OrdersPerDayView(APIView):
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


def get_and_validate_dates(request):
    start = request.query_params.get('start_date')
    end = request.query_params.get('end_date')

    if not start or not end:
        return None, None, JsonResponse({"error": "Both 'start_date' and 'end_date' query parameters are required."}, status=400)

    try:
        start = timezone.datetime.strptime(start, "%Y-%m-%d").strftime("%m/%d/%Y")
        end = timezone.datetime.strptime(end, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        return None, None, JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    return start, end, None


@api_view(['GET'])
def best_selling_combo(request):
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



def get_weather(request):
    city = request.GET.get('city', 'College Station')
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