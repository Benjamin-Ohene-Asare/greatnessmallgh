from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),

    # Greatness Mall routes
    path("products/", include("products.urls")),
    path("events/", include("events.urls")),
    path("leads/", include("leads.urls")),
    path("twi/", include("twi.urls")),
    path("testimonials/", include("testimonials.urls")),
    path("core/", include("core.urls")),

    # FAQ routes
    path("faqs/", include("faqs.public_urls")),
    path("admin-api/faqs/", include("faqs.admin_urls")),
]


# Serve uploaded media during local development only
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )