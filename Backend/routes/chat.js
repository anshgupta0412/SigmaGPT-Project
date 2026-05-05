import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js"
import user from "../models/user.js";

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

// Get all Threads
router.get("/thread", async(req, res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // decending order + most recent chat at the first 
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get the specific thread messages
router.get("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.message);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Deleting
router.delete("/thread/:threadId", async(req, res) => {
    if(!req.isAuthenticated()){
        return res.status(401).json({error: "You must be logged in to delete chats"});
    }

    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }
        res.json({success: "Thread deleted Successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    };
});

// Thread + message route
router.get("/chat", async (req, res) => {
    const {threadId, message} = req.query;

    if(!threadId || !message) {
        return  res.status(400).json({error: "missing required fields"});
    };

    try{ 
        let thread = await Thread.findOne({threadId});

        if(!thread){
            // create new thread in DB.
            thread = new Thread({
                threadId,
                title: message,
                message: [{role: "user", content: message}],
            });
        } else {
        thread.message.push({role: "user", content: message});
        };

        const assistantReply = await getOpenAIAPIResponse(thread.message);

        thread.message.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;

