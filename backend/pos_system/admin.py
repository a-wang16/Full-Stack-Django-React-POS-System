from django.contrib import admin
from .models import Inventory, MenuItem, Employee, Recipe, CustomerOrder, OrderItems


class RecipeInline(admin.TabularInline):
    model = Recipe
    extra = 1
    fields = ('inventory_item', 'qty')
    autocomplete_fields = ['inventory_item']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('username', 'position', 'first_name', 'last_name', 'email')
    search_fields = ('username', 'first_name', 'last_name')


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'quantity', 'unit')
    search_fields = ['name']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'calories', 'category')

    fields = ('name', 'price', 'calories', 'category', 'description', 'photo')
    inlines = [RecipeInline]
    # list_editable = ('name', 'price', 'calories', 'category')




@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'menu_item', 'inventory_item', 'qty')

@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'created_at', 'status', 'name')

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'menu_item', 'quantity')


