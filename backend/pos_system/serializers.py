from rest_framework import serializers
from .models import Inventory, MenuItem, Employee, Recipe, CustomerOrder, OrderItems
from django.db.models import F, Q


class InventorySerializer(serializers.ModelSerializer):
    is_low_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = '__all__'

    def get_is_low_quantity(self, obj):
        return obj.quantity <= obj.minimum_quantity


class MenuItemSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    is_out_of_stock = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = '__all__'

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            return request.build_absolute_uri(obj.photo.url)
        return None

    def get_is_out_of_stock(self, obj):
        out_of_stock = Recipe.objects.filter(
            menu_item=obj,
            inventory_item__quantity__lte=F('inventory_item__minimum_quantity')
        ).exists()
        return out_of_stock

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'




class OrderItemsSerializer(serializers.ModelSerializer):
    menu_item_details = MenuItemSerializer(read_only=True, source='menu_item')

    class Meta:
        model = OrderItems
        fields = '__all__'


class CustomerOrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemsSerializer(many=True, source='orderitems_set')
    class Meta:
        model = CustomerOrder
        fields = '__all__'
