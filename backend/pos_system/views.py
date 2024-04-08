from rest_framework import viewsets
from .models import Inventory, MenuItem, Customer, Employee, Recipe, CustomerOrder, OrderItems
from .serializers import (InventorySerializer, MenuItemSerializer, CustomerSerializer,
                          EmployeeSerializer, RecipeSerializer, CustomerOrderSerializer, OrderItemsSerializer)

from django.utils import timezone
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

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


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
    menuId = request.data.get('menuId')
    menuQuantity = int(request.data.get('quantity'))
    # totalPrice = request.data.get('totalPrice')

    # access recipie table and extract all inventory items associated with it
    inventory_items = list(Recipe.objects.filter(menu_item=menuId).values_list('inventory_item', 'qty'))

    parsed_inventory_items = [{'inventoryId': item[0], 'quantity': item[1] * menuQuantity} for item in inventory_items]
    
    # subtract each item from the inventory
    for item in parsed_inventory_items:
        inventoryId = item['inventoryId']
        quantity = item['quantity']

        inventory = Inventory.objects.get(id=inventoryId)

        if inventory.quantity < quantity:
            return Response({"error": "not enough items in inventory"}, status=status.HTTP_400_BAD_REQUEST)
        
        inventory.quantity = inventory.quantity - quantity
        inventory.save()

    return Response({"inventory updated": "success"})

    # populate customer order
    



@api_view(['POST'])
def create_order_example(request):
    order_items = request.data
    print(order_items)

    with transaction.atomic():
        for item in order_items:
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

    return Response({"message": "Inventory updated successfully"}, status=status.HTTP_200_OK)


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

@api_view(['GET'])
def best_selling_combo(request):
    start = request.query_params.get('start_date')
    end = request.query_params.get('end_date')

    if not start or not end:
        return Response({"error": "Both 'start_date' and 'end_date' query parameters are required."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    try:
        start = timezone.datetime.strptime(start, "%Y-%m-%d").strftime("%m/%d/%Y")
        end = timezone.datetime.strptime(end, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        return Response({"error": "Invalid date format. Use MM/DD/YYYY."},
                        status=status.HTTP_400_BAD_REQUEST)

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
                "item1": row[0],
                "item2": row[1],
                "count": row[2]
            })

    return Response(formatted_result, status=status.HTTP_200_OK)

