const BlogSettings = require("../models/blogSettings.model");

const getBlogSettings = async (req, res) => {
  try {
    const settings = await BlogSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Blog settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateBlogSettings = async (req, res) => {
  try {
    const image = req.file ? req.file.destination + req.file.filename : null;
    const { title, subtitle } = req.body;

    let settings = await BlogSettings.findOne();

    if (!settings) {
      settings = new BlogSettings({
        bannerImage: image,
        title,
        subtitle,
        updatedAt: new Date(),
      });
    } else {
      settings.title = title;
      settings.subtitle = subtitle;
      settings.updatedAt = new Date();
      if (image) settings.bannerImage = image;
    }

    await settings.save();
    res.status(200).json({ message: "Blog settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getBlogSettings,
  updateBlogSettings,
};
