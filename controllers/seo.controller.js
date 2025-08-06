const fs = require('fs');
const path = require('path');
const { createLog } = require('./log.controller');

// Define the path to the robots.txt file
const robotsFilePath = path.join(__dirname, '..', 'robots.txt');

const getContentOfRobotFile = async (req, res, next) => {
    try {
        // Read the content of the robots.txt file asynchronously
        fs.readFile(robotsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                next(err)
            }

            // Send the content back to the client
            res.status(200).json({ content: data });
        });
    } catch (error) {
        console.error(error);
        next(error)
    }
}

const updateContentOfRobotFile = async (req, res, next) => {
    try {
        const { content } = req.body; // Assuming the new content comes in the request body

        if (!content) {
            return res.status(400).json({ message: 'New content is required.' });
        }

        // Replace the existing content of the robots.txt file with new content
        fs.writeFile(robotsFilePath, content, (err) => {
            if (err) {
                console.error(err);
                next(err)
            }

            // Log the update (optional)
            createLog('robots.txt content replaced by ' + req.user.name);

            // Send success response
            res.status(200).json({ message: 'robots.txt updated successfully.' });
        });
    } catch (error) {
        console.error(error);
        next(error)
    }
}

const generateSiteMapsXML_File = async (req, res, next) => {

}

const getDetailOfSitemapFileContent = async (req, res, next) => {

}

const updateSitemapFileContent = async (req, res, next) => {

}

const uploadAndReplaceSitemap = async (req, res, next) => {

}

module.exports = {
    getContentOfRobotFile,
    updateContentOfRobotFile,
    generateSiteMapsXML_File,
    getDetailOfSitemapFileContent,
    updateSitemapFileContent,
    uploadAndReplaceSitemap
}