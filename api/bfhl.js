import Cors from 'cors';
import { Buffer } from 'buffer'; // For decoding base64
import mime from 'mime-types'; // To get MIME type

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

// File Handling Logic
function handleFile(base64File) {
    if (!base64File) {
        return {
            file_valid: false,
            file_mime_type: null,
            file_size_kb: null,
        };
    }

    try {
        // Decode Base64 string
        const fileBuffer = Buffer.from(base64File, 'base64');

        // Validate file size (you can adjust this limit as needed)
        const fileSizeKb = fileBuffer.length / 1024;

        // Get MIME type (or null if unknown)
        const fileMimeType = mime.lookup(fileBuffer) || 'application/octet-stream';

        // Return file details
        return {
            file_valid: true,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKb.toFixed(2), // Keeping size in 2 decimal places
        };
    } catch (error) {
        return {
            file_valid: false,
            file_mime_type: null,
            file_size_kb: null,
        };
    }
}

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        try {
            const { data, file } = req.body;

            // Input validation
            if (!Array.isArray(data)) {
                return res.status(400).json({
                    is_success: false,
                    error: "Invalid input: 'data' field is required and should be an array."
                });
            }

            // Handle file processing
            const fileDetails = handleFile(file);

            const user_id = formatUserId("john_doe", "01011990"); // Replace with actual values
            const { numbers, alphabets, highest_alphabet } = processInputData(data);

            return res.status(200).json({
                is_success: true,
                user_id: user_id,
                email: "john@xyz.com", // Replace with actual email
                roll_number: "ABCD123", // Replace with actual roll number
                numbers: numbers,
                alphabets: alphabets,
                highest_alphabet: highest_alphabet,
                file_valid: fileDetails.file_valid,
                file_mime_type: fileDetails.file_mime_type,
                file_size_kb: fileDetails.file_size_kb,
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
