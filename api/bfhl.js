import Cors from 'cors';

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

export default async function handler(req, res) {
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
    } else if (req.method === 'GET') {
        try {
            return res.status(200).json({
                operation_code: 1
            });
        } catch (error) {
            return res.status(500).json({
                error: "An internal error occurred."
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(Method ${req.method} Not Allowed);
    }
}

function formatUserId(fullName, dob) {
    return ${fullName.toLowerCase().replace(/ /g, '_')}_${dob};
}

function processInputData(data) {
    const numbers = [];
    const alphabets = [];
    let highestAlphabet = null;

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (typeof item === 'string' && item.length === 1) {
            alphabets.push(item);
            if (highestAlphabet === null || item.toLowerCase() > highestAlphabet.toLowerCase()) {
                highestAlphabet = item;
            }
        }
    });

    return {
        numbers,
        alphabets,
        highest_alphabet: highestAlphabet ? [highestAlphabet] : []
    };
}
