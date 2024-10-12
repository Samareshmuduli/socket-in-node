const Message = require('../model/messageSchema');
const { param } = require('../Router/userRouter');
/** Save user current message in database
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
// exports.userMessage= async (req, res) => {
//     console.log(req.body)

//     try {
//         if(req.body.newMessage=='')return res.status(400).json({ message: 'message is empty' }); 
//         if(req.body.reciverId=="" ||req.body.senderId=="")return res.status(400).json({ message: 'Both id required' }); 
//        console.log("=====================")
//         const message = new Message({
//             senderId: req.body.senderId,
//             reciverId: req.body.reciverId,
//             message: req.body.newMessage
//         });
//         console.log("data message====",message);
        
//         const newMessage = await message.save();
//         res.status(201).json({
//             message: ' Id and message store successfully',
//             data: newMessage
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message }); 
//     }
// };
/** Show user message  using sendetId and recieverId
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showMessage= async (req, res) => {
    // console.log("7777777777",req.body)
    senderId = req.body.senderId;
    recieverId=req.body.reciverId;
    let messages
    // console.log("senderId ID", senderId, "recieverId",recieverId);
   if(senderId && recieverId){
    //  messages=await Message.find({ senderId: senderId,reciverId:recieverId }).sort({"updatedAt": 1})

     messages = await Message.find({
        $or: [
          { senderId: senderId, reciverId: recieverId },
          { senderId: recieverId, reciverId: senderId }
        ]
      }).sort({ "updatedAt": 1 });
    // console.log('amewsss=====================:', messages.length);
}
    
   res.status(201).json({
    message: ' Message retrive successfully',
    data: messages
    });

};

