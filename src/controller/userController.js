const Message = require('../model/messageSchema');
const User = require('../model/userSchema');
/** User registration
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.register= async (req, res) => {
    console.log(req.body);
  
   
    const { username, password } = req.body;
    if(password=="")return res.status(400).json({ message: 'please enter password' }); 
    
    try {
      
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ message: 'uaername already registered' }); 
      }
   
      const user = new User ({
        username,     
        password,
      });
      // console.log(user);
      const newUser = await user.save();
      res.status(201).json(newUser); // Created
    } catch (err) {
      res.status(400).json({ message: err.message }); 
    }
  };
// exports.getAllUsers= async(req,res)=>{
//   try {
//     const users = await User.find(); 
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }  
/** Get all user with it's last messsage
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
// exports.getAllUsers = async (req, res) => {
//   try {
//     console.log("bbbbbb",req.body)
//     const currentUserId=req.body._id;
//     const users = await User.find();

//     const userMessages = await Promise.all(users.map(async (user) => {
//       // Get the latest message where the user is either sender or receiver
//       const latestMessage = await Message.findOne({
//         $or: [
//           { senderId: user._id, reciverId: currentUserId },
//           { senderId: currentUserId, reciverId: user._id }
          
//         ]
//       })
//       .sort({ createdAt: -1 })  // Sorting in descending order to get the latest message
//       .limit(1);  // To get a single message

//       return {
//         ...user.toObject(), // Convert the user document to a plain object
//         latestMessage: latestMessage || null,  // Add latest message or null if not found
//       };
//     }));
//     console.log("--------",userMessages)
//     res.json(userMessages);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const currentUserId = req.body._id;
    const searchTerm = req.body.searchTerm || '';  // Search term from request body
    console.log('searchTerm', searchTerm)

    // Build a regex query for username if searchTerm is provided
    const searchQuery = searchTerm ? { username: { $regex: searchTerm, $options: 'i' } } : {};

    // Find users based on the search query
    const users = await User.find(searchQuery);

    const userMessages = await Promise.all(users.map(async (user) => {
      // Get the latest message where the user is either sender or receiver
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: user._id, reciverId: currentUserId },
          { senderId: currentUserId, reciverId: user._id }
        ]
      })
      .sort({ createdAt: -1 })  // Sorting in descending order to get the latest message
      .limit(1);  // To get a single message

      return {
        ...user.toObject(),  // Convert the user document to a plain object
        latestMessage: latestMessage || null,  // Add latest message or null if not found
      };
    }));

    // Move the current user to the zero index
    const currentUserIndex = userMessages.findIndex(user => user._id.toString() === currentUserId.toString());

    if (currentUserIndex !== -1) {
      const [currentUser] = userMessages.splice(currentUserIndex, 1);  // Remove current user
      userMessages.unshift(currentUser);  // Place the current user at the start
    }

    console.log("User Messages:", userMessages);
    res.json(userMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// exports.getUserId= async(req,res)=>{
//   console.log("----------------",req.body)
//   try {
//     const users = await User.findOne(req.body.username); 
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }  
/** Login  user
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
  
  const { username, password } = req.body;
  console.log('req.body', req.body)

  try {
  
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    // const match = await bcrypt.compare(password, user.password);
    if (!password) {
      return res.status(401).json({ message: 'Invalid password' }); 
    }
   
    // const token = jwt.sign({ id: user._id }, "Xty139@qt", { expiresIn: '1d' });
    console.log("userid=========================",user)
    res.status(200).json({ message: 'Logged in successfully',user}); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
  