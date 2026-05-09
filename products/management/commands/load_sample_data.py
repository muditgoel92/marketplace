from django.core.management.base import BaseCommand
from products.models import Vendor, Category, Product, ProductMetadata


class Command(BaseCommand):
    help = 'Load sample POC data from Solytics Partners into the marketplace'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...')

        # Create categories
        categories_data = [
            {
                'name': 'Risk Management',
                'description': 'Tools for comprehensive risk assessment and management',
                'icon': 'shield'
            },
            {
                'name': 'Compliance',
                'description': 'Solutions for regulatory compliance and monitoring',
                'icon': 'check-circle'
            },
            {
                'name': 'Data Analytics',
                'description': 'Advanced analytics and data visualization tools',
                'icon': 'chart-bar'
            },
            {
                'name': 'Trading',
                'description': 'Trading execution and surveillance systems',
                'icon': 'trending-up'
            },
            {
                'name': 'AML/CTF',
                'description': 'Anti-Money Laundering and Counter-Terrorist Financing',
                'icon': 'alert-triangle'
            },
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'icon': cat_data['icon']
                }
            )
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {cat.name}'))

        # Create Solytics vendor
        solytics_vendor, created = Vendor.objects.get_or_create(
            name='Solytics Partners',
            defaults={
                'description': 'New-age solutions leveraging advanced technologies to drive innovation, efficiency, and digital transformation for businesses.',
                'website': 'https://www.solytics-partners.com',
                'email': 'info@solytics-partners.com',
                'phone': '+1-XXX-XXX-XXXX',
                'founded_year': 2015,
                'employees': '50-249',
                'locations': 'US, India, UK, UAE, Argentina',
                'rating': 4.5
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created vendor: {solytics_vendor.name}'))

        # Create products from Solytics
        products_data = [
            {
                'name': 'SAMS',
                'description': 'Optimised solution for efficient risk management and AML screening. SAMS provides comprehensive adverse media screening and database access.',
                'short_description': 'Comprehensive AML and risk management platform',
                'category': 'Compliance',
                'features': 'Adverse Media Screening, Database Screening, Risk Assessment, AML Compliance',
                'pricing_model': 'subscription',
                'pricing_description': 'Enterprise pricing available',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'AML/Compliance'},
                    {'key': 'industry', 'value': 'Financial Services'},
                    {'key': 'feature', 'value': 'Adverse Media Screening'},
                ]
            },
            {
                'name': 'Nimbus Uno',
                'description': 'Cutting-edge technology for advanced risk analytics and comprehensive risk management. Powerful tool for real-time risk monitoring.',
                'short_description': 'Advanced risk analytics and management platform',
                'category': 'Risk Management',
                'features': 'Real-time Risk Monitoring, Advanced Analytics, Risk Assessment, Portfolio Analytics',
                'pricing_model': 'subscription',
                'pricing_description': 'Subscription based, contact for pricing',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Risk Management'},
                    {'key': 'industry', 'value': 'Capital Markets'},
                    {'key': 'feature', 'value': 'Real-time Monitoring'},
                ]
            },
            {
                'name': 'MRM Ecosystem',
                'description': 'Multi-Risk Management ecosystem providing integrated solutions for market, credit, and operational risk.',
                'short_description': 'Integrated multi-risk management solution',
                'category': 'Risk Management',
                'features': 'Market Risk, Credit Risk, Operational Risk, Integrated Dashboard',
                'pricing_model': 'custom',
                'pricing_description': 'Custom enterprise solution',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Multi-Risk Management'},
                    {'key': 'industry', 'value': 'Investment Banking'},
                    {'key': 'feature', 'value': 'Integrated Dashboard'},
                ]
            },
            {
                'name': 'NIMBUS DataVerity',
                'description': 'Secure and reliable data management solution for financial institutions. Ensures data integrity and compliance.',
                'short_description': 'Data integrity and compliance management',
                'category': 'Data Analytics',
                'features': 'Data Validation, Compliance Reporting, Data Quality, Security',
                'pricing_model': 'usage_based',
                'pricing_description': 'Usage-based pricing model',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Data Management'},
                    {'key': 'industry', 'value': 'Banking'},
                    {'key': 'feature', 'value': 'Data Validation'},
                ]
            },
            {
                'name': 'Trade Surveillance',
                'description': 'Comprehensive trade surveillance system for monitoring market abuse and suspicious trading activity.',
                'short_description': 'Market abuse and trade monitoring system',
                'category': 'Trading',
                'features': 'Real-time Surveillance, Anomaly Detection, Market Abuse Detection, Reporting',
                'pricing_model': 'subscription',
                'pricing_description': 'Enterprise subscription available',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Trade Surveillance'},
                    {'key': 'industry', 'value': 'Capital Markets'},
                    {'key': 'feature', 'value': 'Anomaly Detection'},
                ]
            },
            {
                'name': 'AI Governance',
                'description': 'Comprehensive AI governance and management solution for enterprise AI systems.',
                'short_description': 'Enterprise AI governance platform',
                'category': 'Compliance',
                'features': 'Model Governance, AI Risk Management, Compliance Tracking, Audit Trails',
                'pricing_model': 'custom',
                'pricing_description': 'Custom pricing for enterprise',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'AI Governance'},
                    {'key': 'industry', 'value': 'Technology'},
                    {'key': 'feature', 'value': 'Model Governance'},
                ]
            },
            {
                'name': 'Risk Assessment Vault',
                'description': 'Secure repository and management system for risk assessments. Enables centralized risk data management.',
                'short_description': 'Centralized risk assessment repository',
                'category': 'Risk Management',
                'features': 'Data Repository, Risk Tracking, Reporting, Secure Storage',
                'pricing_model': 'subscription',
                'pricing_description': 'Subscription-based model',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Risk Assessment'},
                    {'key': 'industry', 'value': 'Financial Services'},
                    {'key': 'feature', 'value': 'Centralized Repository'},
                ]
            },
            {
                'name': 'SAMS Adverse Media Screening',
                'description': 'Specialized adverse media screening solution for enhanced due diligence and compliance.',
                'short_description': 'Advanced adverse media screening tool',
                'category': 'AML/CTF',
                'features': 'Media Monitoring, News Analysis, Risk Scoring, Compliance Alerts',
                'pricing_model': 'subscription',
                'pricing_description': 'Monthly/Annual subscription',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'AML/Adverse Media'},
                    {'key': 'industry', 'value': 'Banking'},
                    {'key': 'feature', 'value': 'Media Analysis'},
                ]
            },
            {
                'name': 'SAMS Database',
                'description': 'Comprehensive sanctions and adverse media database for compliance screening.',
                'short_description': 'Global sanctions and media database',
                'category': 'AML/CTF',
                'features': 'Global Database, Regular Updates, High Accuracy, Compliance Ready',
                'pricing_model': 'subscription',
                'pricing_description': 'Subscription with regular updates',
                'demo_available': True,
                'metadata': [
                    {'key': 'use_case', 'value': 'Sanctions Screening'},
                    {'key': 'industry', 'value': 'All Financial Institutions'},
                    {'key': 'feature', 'value': 'Database Access'},
                ]
            },
        ]

        for prod_data in products_data:
            metadata = prod_data.pop('metadata', [])
            category = categories.get(prod_data.pop('category'))

            product, created = Product.objects.get_or_create(
                vendor=solytics_vendor,
                name=prod_data['name'],
                defaults={
                    **prod_data,
                    'category': category
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

                # Add metadata
                for meta in metadata:
                    ProductMetadata.objects.get_or_create(
                        product=product,
                        key=meta['key'],
                        value=meta['value']
                    )
                    self.stdout.write(f'  Added metadata: {meta["key"]}={meta["value"]}')

        self.stdout.write(self.style.SUCCESS('✓ Sample data loaded successfully!'))
