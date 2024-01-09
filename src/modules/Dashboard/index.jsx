import React, { useEffect, useState } from 'react'
import avtar from "../../assets/avtar.png"
import rishab from "../../assets/rishab.png"
import Input from '../../components/Input'
import img0 from "../../assets/img0.png"
import img1 from "../../assets/img1.png"
import img2 from "../../assets/img2.png"
import img3 from "../../assets/img3.png"
import img4 from "../../assets/img4.png"
import img5 from "../../assets/img5.png"

const imageArray = [img0,img1,img2,img3,img4,img5];

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetchConversations = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
      const res = await fetch(`chat-app-backened.vercel.app/api/conversations/${loggedInUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      setConversations(resData)
    }    
    fetchConversations()   
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`chat-app-backened.vercel.app/api/users/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const resData = await res.json()
      setUsers(resData)
    }
    fetchUsers()
  }, [])

  const fetchMessages = async (conversationId, receiver) => {
    //console.log(conversationId,receiver)
    const res = await fetch(`chat-app-backened.vercel.app/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const resData = await res.json()
    setMessages({ messages: resData, receiver, conversationId })
  }
  const sendMessage = async (e) => {
    try {
      //console.log("SEND Message>> ", message, messages?.conversationId, user?.id, messages?.receiver?.receiverId);
      const res = await fetch(`chat-app-backened.vercel.app/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: messages?.conversationId,
          senderId: user?.id,
          message,
          receiverId: messages?.receiver?.receiverId
        })
      });
  
      // Check if the request was successful (status code 2xx)
      if (res.ok) {
        // Reset the message input
        setMessage('');
      } else {
        // Handle non-2xx HTTP errors
        const errorData = await res.json();
        console.error("Error sending message:", errorData);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error.message);
    }
  };
  
  
  return (
    <div className="w-screen flex ">
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex justify-center items-center my-8">
          <div className="border border-primary p-[2px] rounded-full">
            <img src={rishab} width={75} height={75} />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">{user?.fullName}</h3>
            <p className="text-lg font-light">My account</p>
          </div>
        </div>
        <hr />
        <div className="ml-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {conversations.length > 0 ?
              conversations.map((conversation) => {
                const { user, conversationId } = conversation;
                return (
                    <div className="flex items-center my-8 border-b border-b-gray-300" key={conversationId}>
                        <div className="cursor-pointer flex" onClick={() => fetchMessages(conversationId, user)}>
                            <div><img src={avtar} width={60} height={60} alt="avatar" /></div>
                            <div className="ml-8">
                                <h3 className="text-lg font-semibold">{user?.fullName}</h3>
                                <p className="text-sm font-light text-gray-400">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                );
              }) : <div className="text-center text-lg font-semibold mt-24">No conversations</div>
            }
          </div>
        </div>
      </div>


      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {
          messages?.receiver?.fullName &&
          <div className="w-[75%] bg-secondary h-[80px] mb-5 mt-14 rounded-full flex items-center px-14">
            <div className="cursor-pointer"><img src={avtar} width={60} height={60} /></div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
              <p className="text-sm font-light text-gray-400">{messages?.receiver?.email}</p>
            </div>
            <div className="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a1 1 0 0 1 .877 .519l.051 .11l2 5a1 1 0 0 1 -.313 1.16l-.1 .068l-1.674 1.004l.063 .103a10 10 0 0 0 3.132 3.132l.102 .062l1.005 -1.672a1 1 0 0 1 1.113 -.453l.115 .039l5 2a1 1 0 0 1 .622 .807l.007 .121v4c0 1.657 -1.343 3 -3.06 2.998c-8.579 -.521 -15.418 -7.36 -15.94 -15.998a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" stroke-width="0" fill="currentColor" /></svg></div>
          </div>
        }


        <div className="h-[75%] w-full overflow-y-scroll border-b">
          <div className="px-5 py-10">
            {
              messages?.messages?.length > 0 ?
                messages.messages.map(({ message, user: { id } = {} }) => {
                  if (id === user?.id) {
                    return (
                      <div className="min-h-[50px] max-w-[40%] p-2 mb-6 bg-primary rounded-b-xl rounded-tl-lg ml-auto flex items-center text-white">
                        {message}
                      </div>
                    )
                  } else {
                    return (
                      <div className="min-h-[50px] max-w-[40%] p-2 mb-6 bg-secondary rounded-b-xl rounded-tr-lg flex items-center">
                        {message}
                      </div>
                    )
                  }
                }) : <div className="text-center text-lg font-semibold mt-24">No messages or No Conversation Selected</div>
            }
          </div>
        </div>
        {
          messages?.receiver?.fullName &&
          <div className="py-2 px-8 w-full flex items-center">
            <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-[75%]" inputClassName="p-4 border-0 shadow-md bg-light focus:ring-0 focus:border-0 bg-secondary rounded-full"></Input>
            <div className={`pt-4 ml-4 cursor-pointer ${!message && 'pointer-events-none'}`} onClick={() => { sendMessage() }}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="35" height="35" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg></div>
            <div className={`pt-4 ml-4 cursor-pointer ${!message && 'pointer-events-none'}`} ><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="35" height="35" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg></div>
          </div>
        }
      </div>


      <div className="w-[25%] h-screen bg-light px-8 py-16">
        <div className="text-primary text-lg">People</div>
        <div>
          {users.length > 0 ?
            users.map(({ userId, user },idx) => {
              const userImage = imageArray[idx % imageArray.length]
              return (
                <div className="flex items-center my-8 border-b border-b-gray-300">
                  <div className="cursor-pointer flex" onClick={() => fetchMessages('new', user)}>
                    <div><img src={userImage} width={60} height={60} /></div>
                    <div className="ml-8">
                      <h3 className="text-lg font-semibold">{user?.fullName}</h3>
                      <p className="text-sm font-light text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )
            }) : <div className="text-center text-lg font-semibold mt-24">No conversations</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
