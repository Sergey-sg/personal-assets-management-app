import React, {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useFormikContext } from 'formik'
import { ReactComponent as ProfileIcon } from 'assets/icons/profile.svg'
import { CONSTANTS } from 'shared/constants'

type UploadAvatarButtonProps = {
  fieldName: string
  imgUrl?: string | null
  setFieldValue: (name: string, value: any) => void
}

export const UploadAvatarButton = ({
  fieldName,
  imgUrl,
  setFieldValue,
}: UploadAvatarButtonProps) => {
  const { submitForm } = useFormikContext()
  const inputFile: MutableRefObject<null> = useRef(null)
  const [img, setImg] = useState(imgUrl)

  useEffect(() => {
    if (!imgUrl) {
      return
    }
    const avatar = imgUrl.includes('googleusercontent')
      ? imgUrl
      : `${CONSTANTS.CLOUDINARY_FILE_STORAGE}${imgUrl}`

    setImg(avatar)
  }, [imgUrl])

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.currentTarget && event.currentTarget.files) {
      const file = event.currentTarget.files[0]

      setFieldValue(fieldName, file)
      setImg(URL.createObjectURL(file))

      submitForm()
    }
  }

  return (
    <>
      <label ref={inputFile} className="upload-avatar-button">
        {img ? (
          <div className=" w-14 h-14 rounded-full border-4 border-green-light hover:border-green-hover cursor-pointer flex items-center justify-center overflow-hidden">
            <img
              src={img}
              alt="user avatar"
              title="Avatar upload"
              className=" w-full h-full"
            />
          </div>
        ) : (
          <div className=" w-12 h-12 rounded-full border-2 border-grey flex items-center justify-center">
            <ProfileIcon title="Avatar upload" />
          </div>
        )}
        <input
          className="hidden"
          id={fieldName}
          name={fieldName}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          ref={inputFile}
        />
      </label>
    </>
  )
}
