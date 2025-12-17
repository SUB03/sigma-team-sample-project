from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer


class ReviewPagination(PageNumberPagination):
    """Кастомная пагинация для отзывов"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        """Добавляем total_pages в ответ"""
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'page_size': self.page.paginator.per_page,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


class CourseReviewsAPIView(APIView):
    """API endpoint для получения отзывов курса"""
    
    def get(self, request, course_id):
        """Получить все отзывы для конкретного курса с пагинацией"""
        reviews = Review.objects.filter(course_id=course_id).order_by('-created_at')
        
        # Применяем пагинацию
        paginator = ReviewPagination()
        paginated_reviews = paginator.paginate_queryset(reviews, request)
        serializer = ReviewSerializer(paginated_reviews, many=True)
        
        return paginator.get_paginated_response(serializer.data)


class AddReviewAPIView(APIView):
    """API endpoint для добавления отзыва"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, course_id):
        """Добавить отзыв к курсу"""
        # Проверяем, не оставлял ли пользователь уже отзыв на этот курс
        existing_review = Review.objects.filter(
            course_id=course_id,
            user_id=request.user.id
        ).first()
        
        if existing_review:
            return Response(
                {
                    'error': 'Вы уже оставили отзыв на этот курс'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = request.data.copy()
        data['course_id'] = course_id
        data['user_id'] = request.user.id
        
        serializer = ReviewSerializer(data=data)
        
        if serializer.is_valid():
            review = serializer.save()
            
            return Response(
                {
                    'message': 'Отзыв успешно добавлен',
                    'review': ReviewSerializer(review).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'error': 'Ошибка валидации данных',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class UpdateReviewAPIView(APIView):
    """API endpoint для обновления отзыва"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request, review_id):
        """Обновить отзыв"""
        review = get_object_or_404(Review, id=review_id)
        
        # Проверяем, что пользователь обновляет свой отзыв
        if review.user_id != request.user.id:
            return Response(
                {
                    'error': 'Вы можете редактировать только свои отзывы'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                {
                    'message': 'Отзыв успешно обновлен',
                    'review': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'error': 'Ошибка валидации данных',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class DeleteReviewAPIView(APIView):
    """API endpoint для удаления отзыва"""
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, review_id):
        """Удалить отзыв"""
        review = get_object_or_404(Review, id=review_id)
        
        # Проверяем, что пользователь удаляет свой отзыв
        if review.user_id != request.user.id:
            return Response(
                {
                    'error': 'Вы можете удалять только свои отзывы'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        review.delete()
        
        return Response(
            {
                'message': 'Отзыв успешно удален'
            },
            status=status.HTTP_200_OK
        )


class CourseAverageRatingAPIView(APIView):
    """API endpoint для получения среднего рейтинга курса"""
    
    def get(self, request, course_id):
        """Получить средний рейтинг курса"""
        reviews = Review.objects.filter(course_id=course_id)
        
        if not reviews.exists():
            average_rating = 0.0
        else:
            average_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        
        return Response(
            {
                'course_id': course_id,
                'average_rating': round(average_rating, 2) if average_rating else 0.0,
                'reviews_count': reviews.count()
            },
            status=status.HTTP_200_OK
        )


class UserReviewsAPIView(APIView):
    """API endpoint для получения всех отзывов пользователя"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Получить все отзывы текущего пользователя с пагинацией"""
        reviews = Review.objects.filter(user_id=request.user.id).order_by('-created_at')
        
        # Применяем пагинацию
        paginator = ReviewPagination()
        paginated_reviews = paginator.paginate_queryset(reviews, request)
        serializer = ReviewSerializer(paginated_reviews, many=True)
        
        return paginator.get_paginated_response(serializer.data)

class UserCourseReviewAPIView(APIView):
    """API endpoint для получения отзыва пользователя на конкретный курс"""
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        """Получить отзыв текущего пользователя на конкретный курс"""
        review = Review.objects.filter(course_id=course_id, user_id=request.user.id).first()

        if not review:
            return Response(
                {
                    'message': 'Отзыв не найден'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                'id': review.id,
                'course_id': review.course_id,
                'user_id': review.user_id,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at,
                'updated_at': review.updated_at
            },
            status=status.HTTP_200_OK
        )
