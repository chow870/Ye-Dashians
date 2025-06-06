import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MapWithRoute from './MoreDetailsMap';
import PlacePhotos from './Cards/PhotoReference';

export default function MoreDetailsCard() {
    const location = useLocation();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [currentGoogleReviewIndex, setCurrentGoogleReviewIndex] = useState(0);
    const [currentYeDashiansReviewIndex, setCurrentYeDashiansReviewIndex] = useState(0);
    const [yeDashiansReview, setYeDashiansReview] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const item = JSON.parse(decodeURIComponent(queryParams.get('item')));
    const mylocation = JSON.parse(decodeURIComponent(queryParams.get('mylocation')));
    const destinationLocation = JSON.parse(decodeURIComponent(queryParams.get('destinationLocation')));

    useEffect(() => {
        async function fetchReviews() {
            try {
                let response = await fetch(`/api/v1/fetchReviews?place_id=${item.place_id}`);
                if (response.ok) {
                    let result = await response.json();
                    setYeDashiansReview(result.reviews);
                } else {
                    setYeDashiansReview([]);
                }
            } catch (error) {
                console.log("Error fetching reviews", error);
                setYeDashiansReview([]);
            }
        }
        fetchReviews();
    }, [item.place_id]);

    useEffect(() => {
        const photoInterval = setInterval(() => {
            setCurrentPhotoIndex((prev) => (prev + 1) % item.additionalDetails.result.photos.length);
        }, 5000);

        const googleReviewInterval = setInterval(() => {
            setCurrentGoogleReviewIndex((prev) => (prev + 1) % item.additionalDetails.result.reviews.length);
        }, 5000);

        const yeDashiansReviewInterval = setInterval(() => {
            if (yeDashiansReview?.length) {
                setCurrentYeDashiansReviewIndex((prev) => (prev + 1) % yeDashiansReview.length);
            }
        }, 5000);

        return () => {
            clearInterval(photoInterval);
            clearInterval(googleReviewInterval);
            clearInterval(yeDashiansReviewInterval);
        };
    }, [item.additionalDetails.result.photos.length, item.additionalDetails.result.reviews.length, yeDashiansReview]);

    if (yeDashiansReview == null) {
        return <p className="text-center text-white">Preparing this page for you...</p>;
    }

    return (
        <div className="flex h-screen bg-black text-gray-200">
            <div className="w-1/2 p-6 flex items-center justify-center">
                <LoadScript googleMapsApiKey= {"AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w"} >
                    <MapWithRoute myLocation={mylocation} lat={item.geometry.location.lat} lng={item.geometry.location.lng} />
                </LoadScript>
            </div>
            <div className="w-1/2 p-8 bg-gray-900 rounded-lg shadow-lg overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6">Place Details</h2>

                <div className="space-y-6">
                {/* <PlacePhotos photoReferences={item.additionalDetails.result.photos.map(photo => photo.photo_reference)} /> */}

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-2">
                        <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                        <p><strong>Rating:</strong> {item.rating || 'N/A'}</p>
                        {/* <p><strong>Distance (You):</strong> {item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</p> */}
                        {/* <p><strong>Distance (Your Partner):</strong> {item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</p> */}
                        <p><strong>Open Now:</strong> {item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</p>
                        <p><strong>Tags:</strong> {item.tags?.join(', ') || 'N/A'}</p>
                        <p><strong>Address:</strong> {item.additionalDetails.result.formatted_address || 'N/A'}</p>
                        <p><strong>Phone Number:</strong> {item.additionalDetails.result.formatted_phone_number || 'N/A'}</p>
                        <p><strong>Serves Dinner:</strong> {item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</p>
                        <p><strong>Delivery:</strong> {item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</p>
                        <p><strong>Takeout:</strong> {item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Reviews From Google</h3>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-left">
                            <p>{item.additionalDetails.result.reviews[currentGoogleReviewIndex].text}</p>
                            <p className="font-semibold">Rating: {item.additionalDetails.result.reviews[currentGoogleReviewIndex].rating}/5</p>
                            <p className="text-sm text-gray-500">Author: {item.additionalDetails.result.reviews[currentGoogleReviewIndex].author_name}</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Reviews From Ye-Dashians</h3>
                        {yeDashiansReview.length > 0 ? (
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-left">
                                <p>{yeDashiansReview[currentYeDashiansReviewIndex].text}</p>
                                <p className="font-semibold">Rating: {yeDashiansReview[currentYeDashiansReviewIndex].stars}/5</p>
                                <p className="text-sm text-gray-500">Author: {yeDashiansReview[currentYeDashiansReviewIndex].userName}</p>
                            </div>
                        ) : (
                            <p>No Ye-Dashian reviews available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
