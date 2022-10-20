import React from 'react'
import { Typography } from 'components/common/Typography'
import { ReactComponent as AddContactIcon } from 'assets/icons/add-contact.svg'
import { ReactComponent as ProfileIcon } from 'assets/icons/profile.svg'
import { CONSTANTS } from 'shared/constants'

interface ProfileCardProps {
  avatar: string | null
  name: string
  phone?: string
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatar,
  name,
  phone,
  setShowModal,
  showModal,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className=" flex align-middle">
        <div className="w-12 h-12 bg-white mr-3 rounded-full overflow-hidden shrink-0 flex items-center justify-center border-2">
          {avatar ? (
            <img
              src={`${CONSTANTS.CLOUDINARY_FILE_STORAGE}${avatar}`}
              alt={name}
            />
          ) : (
            <ProfileIcon
              className="flex items-center justify-center"
              title="Avatar upload"
            />
          )}
        </div>
        <div>
          <Typography type="Ag-13-bold" className="w-full">
            {name}
          </Typography>
          <Typography type="Ag-13-medium" className="w-full">
            {phone || ''}
          </Typography>
        </div>
      </div>
      <div className="flex">
        <AddContactIcon
          onClick={() => {
            setShowModal(!showModal)
          }}
        />
      </div>
    </div>
  )
}
