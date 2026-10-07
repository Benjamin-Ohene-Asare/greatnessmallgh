from django.urls import path

from .views import (
    AdminTestimonialDetailView,
    AdminTestimonialListCreateView,
    PublicTestimonialListView,
)


app_name = "testimonials"


urlpatterns = [
    # Public testimonials
    path(
        "",
        PublicTestimonialListView.as_view(),
        name="testimonial-list",
    ),

    # Admin testimonials
    path(
        "admin/",
        AdminTestimonialListCreateView.as_view(),
        name="admin-testimonial-list-create",
    ),

    # Admin testimonial detail
    path(
        "admin/<int:pk>/",
        AdminTestimonialDetailView.as_view(),
        name="admin-testimonial-detail",
    ),
]