# Generated by Django 4.1.5 on 2023-02-05 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authy', '0002_remove_user_is_admin_alter_user_is_superuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(blank=True, default=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_employee',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
