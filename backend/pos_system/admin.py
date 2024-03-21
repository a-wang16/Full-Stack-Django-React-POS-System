from django.contrib import admin
from .models import Inventory, MenuItem, Customer, Employee, Recipe, CustomerOrder, OrderItems

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'quantity', 'unit')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'calories', 'category')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'position')

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'menu_item', 'inventory_item', 'qty')

@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'customer', 'created_at', 'status', 'name')

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'menu_item', 'quantity')
