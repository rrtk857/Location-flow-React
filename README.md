# Location-flow-React

A fully functional Location/Address flow application built using React for the frontend and Node.js for the backend. It integrates Google Maps API to allow users to search, select, and save delivery addresses with geolocation and map functionalities.

---

## Features

1. **Google Maps Integration**
   - Location search using Google Maps API.
   - Geolocation to detect the user's current location.
   - Adjustable map pin for fine-tuning location.

2. **Address Form**
   - Input fields for address details like House/Flat/Block No., Road/Area.
   - Save addresses under categories such as Home, Office, or Friends & Family.

3. **Address Management**
   - Manage saved addresses with options to update or delete them.
   - Search functionality for recent addresses.

4. **Responsive Design**
   - Fully responsive and optimized for different screen sizes.

---

## Installation

### Prerequisites
- Node.js and npm installed on your system.
- A Google Maps API key. Obtain one from the [Google Cloud Console](https://console.cloud.google.com/).

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Location-flow-React.git
   cd Location-flow-React
   ```

2. Install:
   ```bash
   npm install Location-flow-React --save
   ```

3. Include the Google Maps API script in the `index.html` file:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=<INSERT_YOUR_API_KEY>&v=3.exp&libraries=geometry,drawing,places"></script>
   ```

5. Start using npm:
   ```bash
   npm i
   npm start
   ```

---

## Usage

1. Open the application in your browser at `http://localhost:8081`.
2. Allow location access or search manually using the map.
3. Adjust the pin and fill in the address details.
4. Save, delete addresses using the Address Management.

---

## Technologies Used

### Frontend
- React.js
- Google Maps API

### Backend
- Node.js
- Express.js






