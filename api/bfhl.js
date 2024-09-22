const Cors = require('cors');

// Initialize CORS middleware
const cors = Cors({
    methods: ['GET', 'POST'],
    origin: '*', // Adjust this for better security in production
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

module.exports = async function handler(req, res) {  // Changed to CommonJS export
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        try {
            const { data } = req.body;

            // Input validation
            if (!Array.isArray(data)) {
                return res.status(400).json({
                    is_success: false,
                    error: "Invalid input: 'data' field is required and should be an array."
                });
            }

            const user_id = formatUserId("john_doe", "01011990"); // Replace with actual values
            const { numbers, alphabets, highest_alphabet } = processInputData(data);

            return res.status(200).json({
                is_success: true,
                user_id: user_id,
                email: "john@xyz.com", // Replace with actual email
                roll_number: "ABCD123", // Replace with actual roll number
                numbers: numbers,
                alphabets: alphabets,
                highest_alphabet: highest_alphabet
            });
        } catch (error) {
            return res.status(500).json({
                is_success: false,
                error: "An internal error occurred."
            });
        }
    }
}
