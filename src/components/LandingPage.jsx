import React from 'react';

function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold">Find Your Perfect Hangout Spot!</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Whether you're a music lover looking for the best pre-concert café or a chilled-out park to relax, our app has got you covered.
            Discover ideal meeting spots with minimal commute and personalized recommendations based on your vibe and preferences.
          </p>
        </header>

        {/* Features for Music Lovers */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-pink-500">For Music Lovers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Basic Features</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>User location and venue preferences for a custom experience</li>
                <li>Secure login for personalized searches</li>
                <li>Optimal midpoint calculations to find the perfect spot</li>
                <li>Nearby venue suggestions matching user preferences</li>
                <li>Reviews and Ratings for the best venue insights</li>
                <li>Event reminders and scheduling to stay organized</li>
              </ul>
            </div>
            <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Advanced Features</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>Real-time traffic updates for the best routes</li>
                <li>Event-based suggestions for concerts and festivals</li>
                <li>Multi-criteria matching based on music and ambiance preferences</li>
                <li>Push notifications for arrival alerts</li>
                <li>Reservation integration for seamless bookings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features for Organizers */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-yellow-500">For Event Organizers</h2>
          <p className="text-lg">
            We help event organizers reach a wider audience by listing their events and connecting them with music lovers who want to explore new venues. Let us handle ticket bookings and help you fill every seat for your next event!
          </p>
          <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-2">Organizer Benefits</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>Effortlessly list your events to attract music enthusiasts</li>
              <li>Manage ticket bookings and track availability</li>
              <li>Reach users with personalized event recommendations</li>
              <li>Get real-time updates and feedback from attendees</li>
            </ul>
          </div>
        </section>

        {/* Call to Action
        <div className="text-center space-y-4">
          <button
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition duration-200"
            onClick={() => navigate('/signup')}
          >
            Join as a Music Lover
          </button>
          <button
            className="ml-4 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition duration-200"
            onClick={() => navigate('/organizer/signup')}
          >
            Sign Up as an Organizer
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default LandingPage;
