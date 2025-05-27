# **Team Name**: Checkmate

**Team Members**:
- Happy Lakhotia, Yash Agarwal , Ujjwal Rai , Krishna Kant Kumar , Ankit Chaurasiya

#              Ayurvision

## Overview
Ayurvision is an AI-powered health analysis platform that bridges modern technology with traditional Ayurvedic wisdom. This repository provides a complete workflow for:

1. User login and sign-up.
2. Dashboard for initiating health analysis.
3. Image capturing and uploading for analysis.
4. Patient analysis, including condition information, causes, and remedies.
5. Specialist dashboard for Ayurvedic professionals to view patient reports and AI-powered insights.

## Features

### User Workflow
1. **Login or Sign Up**: Secure authentication system for users to create an account or log in.
2. **Dashboard**: A user-friendly interface to start health analysis.
3. **Image Capture and Upload**:
   - Capture images using the device camera.
   - Upload images directly from the computer.
   - Redirect to the Patient Analysis page for detailed insights.
4. **Patient Analysis**:
   - Displays user data (age, gender, last visit) in a summary box.
   - Provides detailed condition information, causes, and remedies.
   - Shows the uploaded image along with AI-powered analysis.

### Ayurvedic Specialist Workflow
 **Specialist Dashboard**:
   - View all patient reports.
   - Access AI-powered insights and analysis for each patient.
   - Download or share patient data for further use.

## Installation

### Prerequisites
- Node.js
- MongoDB
- A web browser

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Ayurvision.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Ayurvision
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Start MongoDB.
   - Configure the database connection in the `.env` file.

5. Run the application:
   ```bash
   npm start
   ```
6. Access the application at `http://localhost:3000`.

## Technology Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: TensorFlow.js, OpenAI API

## Project Structure
```
Ayurvision
├── public
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── styles
│   └── utils
├── .env
├── package.json
└── README.md
```

## Features in Detail

### Patient Analysis Page
- **User Information**: Displays age, gender, and last visit.
- **Condition Details**:
  - Name and description of the condition.
  - Causes of the disease.
  - Remedies and suggestions powered by Ayurvedic principles.
  - Uploaded image displayed alongside analysis results.

### Specialist Dashboard
- Access a comprehensive overview of all patient reports.
- Analyze AI-generated data for detailed insights.

## Future Enhancements
- Add multilingual support for broader accessibility.
- Integration with wearable devices for real-time data.
- Enhanced AI models for improved accuracy.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.


---

## Contact
For any queries or support, please contact us at `support@ayurvision.com`.
