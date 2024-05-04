from django.contrib import admin
from .models import Inventory, MenuItem, Employee, Recipe, CustomerOrder, OrderItems
from django.contrib.auth.admin import UserAdmin


class RecipeInline(admin.TabularInline):
    model = Recipe
    extra = 1
    fields = ('inventory_item', 'qty')
    autocomplete_fields = ['inventory_item']

@admin.register(Employee)
class EmployeeAdmin(UserAdmin):
    model = Employee
    list_display = ('username', 'position', 'first_name', 'last_name', 'email')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {'fields': ('position',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Additional Info', {'fields': ('position',)}),
    )


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

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'menu_item', 'quantity')

class OrderItemsInline(admin.TabularInline):
    model = OrderItems
    extra = 1

@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'created_at', 'status', 'name', 'list_order_items')
    inlines = [OrderItemsInline]

    def list_order_items(self, obj):
        order_items = obj.orderitems_set.all()
        if order_items:
            return ', '.join([f"{item.menu_item} (x{item.quantity})" for item in order_items])
        else:
            return 'No items'
    list_order_items.short_description = 'Order Items'

