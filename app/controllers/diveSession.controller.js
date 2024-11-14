const { getDecodedAccessToken } = require('../utils/jwt.utils');
const db = require("../models");
const { diveSession: DiveSession } = db;
const diveSessionResponseDto = require("../contracts/diveSession.response.dto");
const diveSessionsResponseDto = require("../contracts/diveSessions.response.dto");

//Admin and User
exports.createMyDiveSession = async (req, res) => {
    try {
        const diveSession = req.body;
        if (!diveSession) return res.status(400).json({message: "Body is empty."});
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const diveSessionToSave = new DiveSession({
            user: userId,
            date: diveSession.date,
            location: diveSession.location,
            gpsLocation: diveSession.gpsLocation,
            waterType: diveSession.waterType,
            temperature: diveSession.temperature,
            diveCount: diveSession.diveCount,
            maxDepth: diveSession.maxDepth,
            maxDiveTime: diveSession.maxDiveTime,
            notes: diveSession.notes
        });
        await diveSessionToSave.save();
        res.status(201).json(diveSessionResponseDto(diveSessionToSave));
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

exports.retrieveMyDiveSessions = async (req, res) => {
    try {
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const diveSessions = await DiveSession.find({user: userId});
        return res.status(200).json(diveSessionsResponseDto(diveSessions));
    } catch(error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

exports.retrieveMyDiveSession = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message: "No dive session inserted."});
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const diveSession = await DiveSession.findOne({
            _id: req.params.id,
            user: userId
        });
        if(!diveSession) return res.status(404).json({message: "No dive session found."});
        res.status(200).json(diveSessionResponseDto(diveSession));
    } catch(error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

exports.updateMyDiveSession = async (req, res) => {
    try {
        const diveSession = req.body;
        if (!diveSession || !req.params.id) return res.status(400).json({message: "Body or id is empty."});
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const diveSessionToUpdate = {
            user: userId,
            date: diveSession.date,
            location: diveSession.location,
            gpsLocation: diveSession.gpsLocation,
            waterType: diveSession.waterType,
            temperature: diveSession.temperature,
            diveCount: diveSession.diveCount,
            maxDepth: diveSession.maxDepth,
            maxDiveTime: diveSession.maxDiveTime,
            notes: diveSession.notes
        };
        const updatedDiveSession = await DiveSession.findByIdAndUpdate(req.params.id, diveSessionToUpdate, { new: true, runValidators: true });
        if (!updatedDiveSession) return res.status(404).json({ message: "Dive session not found." });
        res.status(201).json(diveSessionResponseDto(updatedDiveSession));
    } catch(error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

exports.deleteMyDiveSession = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({message: "Id not present."});
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const deletedDiveSession = await DiveSession.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });
        if (!deletedDiveSession) return res.status(404).json({message: "Dive session not found."});
        res.status(204).send();
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

//Admin
exports.retrieveDiveSessions = async (req, res) => {
    try {
        const diveSessions = await DiveSession.find();
        return res.status(200).json(diveSessionsResponseDto(diveSessions));
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

exports.retrieveDiveSession = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message: "No dive session inserted."});
        const diveSession = await DiveSession.findOne({ _id: req.params.id });
        if(!diveSession) return res.status(404).json({message: "Dive session not found."});
        res.status(200).json(diveSessionResponseDto(diveSession));
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteDiveSession = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({message: "Id not present."});
        const deletedDiveSession = await DiveSession.findByIdAndDelete(req.params.id);
        if (!deletedDiveSession) return res.status(404).json({message: "Dive session not found."});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}