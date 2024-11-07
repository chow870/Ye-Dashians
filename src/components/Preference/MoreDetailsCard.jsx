import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function MoreDetailsCard() {
    const location = useLocation();
    const {
         item
    } = useLocation().state || {};
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

            }
            catch(error){
                console.log("some Error occured while fetchng the reviews", error)
                setYeDashiansReview([])
            }

            
        }

        FetchReviews();
    },[])
    

    if(yeDashiansReview == null ){
        return (
            <p>We are Preparing this page for you.</p>
        )
    }
  return (
    <div>MoreDetailsCard
        <div>here first i will put the map. </div>
        <div> 
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', minWidth: '400px' }}>
                                        <h3>Photos</h3>
                                        {item.additionalDetails.result.photos.map((pic,index)=>{
                                            return(
                                                <img src={`/maps/v1/photo?photo_reference=${pic.photo_reference}`} alt="Place Photo" />
                                            )
                                        })}

                                        <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                                        <p><strong>Rating:</strong> {item.rating || 'N/A'}</p>
                                        <p><strong>Distance (You):</strong> {item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                                        <p><strong>Distance (Your Partner):</strong> {item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                                        <p><strong>Open Now:</strong> {item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</p>
                                        <p><strong>Tags:</strong> {item.tags?.join(', ') || 'N/A'}</p>
                                        <p><strong>Address:</strong>{item.additionalDetails.result.formatted_address || 'N/A'}</p>
                                        <p><strong>Phone Number:</strong> {item.additionalDetails.result.formatted_phone_number || 'N/A'}</p>
                                        <p><strong>Serves Dinner:</strong> {item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</p>
                                        <p><strong>Delivery:</strong> {item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</p>
                                        <p><strong>Takeout:</strong> {item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</p>
                                        <div>
                                            <h2>Reviews From google </h2>
                                            {item.additionalDetails.result.reviews.map((review,index)=>{
                                                return (
                                                    <div key ={{index}} >
                                                    <p>{review.text}</p>
                                                    <p>Ratings: {review.rating}/5</p>
                                                    <p>Author : {review.author_name}</p>
                                                    </div>
                                                )
                                            }) }
                                            <h2>Reviews From Ye-Dashians</h2>
                                                    {
                                                    yeDashiansReview.length == 0? <p>Be the first ye dashian to review this place</p>:
                                                                yeDashiansReview.map((review,index)=>{
                                                                    return (
                                                                        <div key ={{index}} >
                                                                        <p>{review.text}</p>
                                                                        <p>Ratings: {review.stars}/5</p>
                                                                        <p>Author : {review.userName}</p>
                                                                        </div>
                                                                    )
                                                                }) 
                                                    }
                                            
                                        </div>

\            </div>

        </div>


    </div>
  )
}
