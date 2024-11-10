import React from 'react'

function UserHomePage() {
  return (
    <div>
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
                  <li><strong>User location and venue preferences</strong> for a customized experience</li>
                  <li><strong>Secure login</strong> for personalized searches and suggestions</li>
                  <li><strong>Optimal midpoint calculations</strong> to find the best meeting spots</li>
                  <li><strong>Nearby venue suggestions</strong> tailored to your preferences</li>
                  <li><strong>Reviews and Ratings</strong> for honest feedback from fellow music lovers</li>
                  <li><strong>Event reminders and scheduling</strong> to ensure you never miss a concert</li>
                </ul>
              </div>
              <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">Advanced Features</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>Real-time traffic updates</strong> to help you navigate to the venue easily</li>
                  <li><strong>Event-based suggestions</strong> based on your favorite concerts and festivals</li>
                  <li><strong>Multi-criteria matching</strong> for music and ambiance preferences</li>
                  <li><strong>Push notifications</strong> to notify you about upcoming events and arrival alerts</li>
                  <li><strong>Reservation integration</strong> for hassle-free bookings at the best spots</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default UserHomePage
