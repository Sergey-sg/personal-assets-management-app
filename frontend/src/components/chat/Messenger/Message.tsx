import React from 'react'
import { formatRelative } from 'date-fns'
import { IAuthor } from '../interfaces'
import { useAppSelector } from 'hooks/useAppDispatch'
import { ReactComponent as ProfileIcon } from 'assets/icons/profile.svg'
import { CONSTANTS } from 'shared/constants'

interface Props {
  message: {
    id: number
    content: string
    author: IAuthor
    createdAt: string
  }
}

export const Message: React.FC<Props> = ({ message }) => {
  const user = useAppSelector((state) => state.userProfile)

  return (
    <div className="flex flex-col mb-5 last:mb-0 px-5">
      <div
        className={`flex items-center gap-3  ${
          message.author.id === user.id
            ? 'flex-row-reverse text-orange'
            : 'text-blue'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
            message.author.id === user.id ? 'bg-orange' : 'bg-blue'
          }`}
        >
          {message.author.avatarPath ? (
            <img
              src={`${CONSTANTS.CLOUDINARY_FILE_STORAGE}${message.author.avatarPath}`}
              alt={message.author.firstName}
            />
          ) : (
            <ProfileIcon
              className="flex items-center justify-center"
              title="Avatar upload"
            />
          )}
        </div>
        <div className={`text-Ag-14 font-bold whitespace-nowrap`}>
          {`${message.author.firstName} ${message.author.lastName}`}
        </div>
      </div>
      <div
        className={`flex justify-between p-2 ${
          message.author.id === user.id && 'flex-row-reverse'
        }`}
      >
        <div className="text-sm text-gray-600 bg-gray-ultralight rounded-full px-3 py-2 w-3/5">
          {message.content}
        </div>
        <div className="text-xs text-gray-400">
          {formatRelative(new Date(message.createdAt), new Date())}
        </div>
      </div>
    </div>
  )
}
