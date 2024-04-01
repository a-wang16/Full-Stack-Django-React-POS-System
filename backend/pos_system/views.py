from rest_framework import viewsets
from .models import Inventory, MenuItem, Customer, Employee, Recipe, CustomerOrder, OrderItems
from .serializers import (InventorySerializer, MenuItemSerializer, CustomerSerializer,
                          EmployeeSerializer, RecipeSerializer, CustomerOrderSerializer, OrderItemsSerializer)

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
    



    