import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
const PlacePhotos = ({ photoReferences }) => {
    const [photos, setPhotos] = useState([]);
    console.log(photoReferences)

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const photoPromises = photoReferences.map(async (photoReference) => {
                    const response = await axios.get(`${BackendBaseUrl}/maps/v1/photo`, {
                        params: { photo_reference: photoReference },
                        timeout: 10000, // 10 seconds
                    });
                    return response.data.image; // Return the base64 image
                });

                const images = await Promise.all(photoPromises); // Wait for all photos to load
                setPhotos(images);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        if (photoReferences && photoReferences.length > 0) {
            fetchPhotos();
        }
    }, [photoReferences]);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2 text-white">Photos</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Place ${index + 1}`}
                            className="w-64 h-64 object-cover rounded-lg shadow-lg"
                        />
                    ))
                ) : (
                    <p className="text-white">Loading photos...</p>
                )}
            </div>
        </div>
    );
};

export default PlacePhotos;
