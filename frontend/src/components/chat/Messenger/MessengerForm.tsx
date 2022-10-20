import React, { useRef, useState } from 'react'
import { ReactComponent as UploadIcon } from 'assets/icons/upload.svg'
import { ReactComponent as SendIcon } from 'assets/icons/send.svg'
import { ReactComponent as EmojiIcon } from 'assets/icons/emoji.svg'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { createNewMessage } from 'redux/slice/messages/messages.actionCreator'
// import data from '@emoji-mart/data'
import { Picker, EmojiData, BaseEmoji } from 'emoji-mart'

interface Props {
  conversationId: number | null
}

export const MessengerForm: React.FC<Props> = ({ conversationId }) => {
  const dispatch = useAppDispatch()
  const [content, setContent] = useState('')

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log('Sending message', content)

    if (!conversationId || !content) return

    const message = {
      content,
      conversationId,
    }

    dispatch(createNewMessage(message))
    setContent('')
  }

  const oNEmojiClick = (e: BaseEmoji) => {
    console.log(e.native)
    // setContent(content + e.native)
  }

  return (
    <>
      <form onSubmit={handleSendMessage}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <label
            htmlFor="file-upload"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-green hover:bg-gray-100"
          >
            <UploadIcon className=" w-8 h-8" />
          </label>
          <input id="file-upload" type="file" className="hidden" />

          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-green hover:bg-gray-100"
          >
            <EmojiIcon className=" w-8 h-8" />
            <span className="sr-only">Add emoji</span>
          </button>
          <textarea
            id="chat"
            rows={1}
            className="block mx-4 p-2.5 w-full text-sm text-gray-600 bg-white rounded-lg border border-gray-300 focus:ring-green focus:border-green-light resize-none"
            placeholder="Your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="inline-flex justify-center p-2 text-green rounded-full cursor-pointer hover:bg-gray-100"
            disabled={!content || !conversationId}
          >
            <SendIcon className=" w-8 h-8" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
      {/* <Picker
        showPreview={false}
        showSkinTones={false}
        theme="dark"
        onSelect={oNEmojiClick}
      /> */}
    </>
  )
}
