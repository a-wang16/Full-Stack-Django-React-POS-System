from django.core.management.base import BaseCommand
from django.db.models import Count
from pos_system.models import Inventory

class Command(BaseCommand):
    help = 'Deduplicates inventory items by name'

    def handle(self, *args, **options):
        duplicates = Inventory.objects.values('name').annotate(name_count=Count('id')).filter(name_count__gt=1)

        for item in duplicates:
            items = Inventory.objects.filter(name=item['name']).order_by('id')

            first_item = items.first()
            items.exclude(id=first_item.id).delete()

            self.stdout.write(self.style.SUCCESS(f'Deduplicated items with name: {item["name"]}'))
