from django.db import models
from django.contrib.auth.models import AbstractUser


class Employee(AbstractUser):
    position = models.CharField(max_length=255)



class Inventory(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50)
    minimum_quantity = models.IntegerField(default=10)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    calories = models.IntegerField()
    category = models.CharField(max_length=255)

    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='menu_items_photos/', blank=True, null=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)

    def __str__(self):
        return self.name




class Recipe(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    qty = models.IntegerField()


class CustomerOrder(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField()
    status = models.CharField(max_length=50)
    name = models.CharField(max_length=255)


class OrderItems(models.Model):
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(quantity__gt=0), name='quantity_gt_0'),
        ]
