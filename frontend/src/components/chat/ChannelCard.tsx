import React from 'react'
import { formatRelative } from 'date-fns'
import { Typography } from 'components/common/Typography'
import { ReactComponent as ProfileIcon } from 'assets/icons/profile.svg'
import { CONSTANTS } from 'shared/constants'

interface MessageCardProps {
  avatar: string | null
  name: string
  timeStamp: string
  isActiveChannel: boolean
  onClick: () => void
  lastMessage: string
}

export const ChannelCard: React.FC<MessageCardProps> = ({
  avatar,
  name,
  timeStamp,
  isActiveChannel,
  lastMessage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={
        (isActiveChannel ? 'bg-gray-ultralight ' : '') +
        'w-full min-h-[74px] flex flex-row p-4 gap-2 hover:bg-gray-light hover:cursor-pointer rounded-lg'
      }
    >
      <div className="flex items-center justify-center w-12 h-12 bg-green-light mr-3 rounded-full overflow-hidden shrink-0">
        {avatar ? (
          <img
            src={`${CONSTANTS.CLOUDINARY_FILE_STORAGE}${avatar}`}
            alt={name}
          />
        ) : (
          <ProfileIcon
            title="Avatar upload"
            className="w-11 h-11 stroke-white "
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        <Typography
          type="Ag-13-bold"
          className="w-full whitespace-nowrap  mb-2"
        >
          {name}
        </Typography>
        <div className="flex flex-row justify-between">
          <Typography type="Ag-13-medium" className="w-full">
            {lastMessage || 'No messages yet'}
          </Typography>
          <Typography
            type="Ag-12-normal"
            className="w-full text-end text-gray-400"
          >
            {/* {timeStamp} */}
            {formatRelative(new Date(timeStamp), new Date()) || ''}
          </Typography>
        </div>
      </div>
    </div>
  )
}
