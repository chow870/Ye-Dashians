import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import MapWithRoute from './MoreDetailsMap';

export default function MoreDetailsCard() {
    const location = useLocation();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [currentGoogleReviewIndex, setCurrentGoogleReviewIndex] = useState(0);
    const [currentYeDashiansReviewIndex, setCurrentYeDashiansReviewIndex] = useState(0);
    const {
         item,mylocation
    } = location.state || {};
    console.log("item on more detials page : ", item,mylocation)
    const [yeDashiansReview, setYeDashiansReview] =useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(()=>{
        async function FetchReviews ()  {
            try{
                let response = await fetch(`/api/v1/fetchReviews?place_id=${item.place_id}`,{

                })
                if(response.ok){
                    let result = await response.json();
                    setYeDashiansReview(result.reviews);
                }
                else{
                    setYeDashiansReview([])
                }

            }
            catch(error){
                console.log("some Error occured while fetchng the reviews", error)
                setYeDashiansReview([])
            }

            
        }

        FetchReviews();
    },[])

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % item.additionalDetails.result.photos.length);
    };
    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + item.additionalDetails.result.photos.length) % item.additionalDetails.result.photos.length);
    };

    const handleNextGoogleReview = () => {
        setCurrentGoogleReviewIndex((prevIndex) => (prevIndex + 1) % item.additionalDetails.result.reviews.length);
    };
    const handlePrevGoogleReview = () => {
        setCurrentGoogleReviewIndex((prevIndex) => (prevIndex - 1 + item.additionalDetails.result.reviews.length) % item.additionalDetails.result.reviews.length);
    };

    const handleNextYeDashiansReview = () => {
        setCurrentYeDashiansReviewIndex((prevIndex) => (prevIndex + 1) % yeDashiansReview.length);
    };
    const handlePrevYeDashiansReview = () => {
        setCurrentYeDashiansReviewIndex((prevIndex) => (prevIndex - 1 + yeDashiansReview.length) % yeDashiansReview.length);
    };
    

    if(yeDashiansReview == null ){
        return (
            <p>We are Preparing this page for you.</p>
        )
    }
    return (
        <>
        <div>
        <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w" >
            <MapWithRoute myLocation={mylocation} lat={item.geometry.location.lat} lng ={item.geometry.location.lng}/>
        </LoadScript>

        </div>
         <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">More Details Card</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Photos</h3>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevPhoto} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Prev
                    </button>
                    <img src={`/maps/v1/photo?photo_reference=${item.additionalDetails.result.photos[currentPhotoIndex].photo_reference}`}
                        alt="Place Photo"
                        className="w-64 h-64 object-cover rounded-lg shadow-md"
                    />
                    <button onClick={handleNextPhoto} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Next
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                <p><strong>Rating:</strong> {item.rating || 'N/A'}</p>
                <p><strong>Distance (You):</strong> {item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                <p><strong>Distance (Your Partner):</strong> {item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                <p><strong>Open Now:</strong> {item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</p>
                <p><strong>Tags:</strong> {item.tags?.join(', ') || 'N/A'}</p>
                <p><strong>Address:</strong> {item.additionalDetails.result.formatted_address || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {item.additionalDetails.result.formatted_phone_number || 'N/A'}</p>
                <p><strong>Serves Dinner:</strong> {item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</p>
                <p><strong>Delivery:</strong> {item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</p>
                <p><strong>Takeout:</strong> {item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</p>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Reviews From Google</h2>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevGoogleReview} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Prev
                    </button>
                    <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
                        <p>{item.additionalDetails.result.reviews[currentGoogleReviewIndex].text}</p>
                        <p className="font-semibold">Rating: {item.additionalDetails.result.reviews[currentGoogleReviewIndex].rating}/5</p>
                        <p className="text-sm text-gray-500">Author: {item.additionalDetails.result.reviews[currentGoogleReviewIndex].author_name}</p>
                    </div>
                    <button onClick={handleNextGoogleReview} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Next
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Reviews From Ye-Dashians</h2>
                <div className="flex items-center gap-4">
                    {yeDashiansReview.length > 0 ? (
                        <>
                            <button onClick={handlePrevYeDashiansReview} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Prev
                            </button>
                            <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
                                <p>{yeDashiansReview[currentYeDashiansReviewIndex].text}</p>
                                <p className="font-semibold">Rating: {yeDashiansReview[currentYeDashiansReviewIndex].stars}/5</p>
                                <p className="text-sm text-gray-500">Author: {yeDashiansReview[currentYeDashiansReviewIndex].userName}</p>
                            </div>
                            <button onClick={handleNextYeDashiansReview} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Next
                            </button>
                        </>
                    ) : (
                        <p>Be the first Ye-Dashian to review this place</p>
                    )}
                </div>
            </div>
        </div>

        </>
       
       
    );
}
