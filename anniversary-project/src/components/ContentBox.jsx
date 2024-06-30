import { Html } from '@react-three/drei'

const ContentBox = ({clickFunction, text, imageSource}) => {

  
  return (
    <Html position={[0, 0, 0]} center={true}>
      <div className='bg-black border-2 rounded-lg m-2 p-10 h-full w-[50rem]'>
        <button className="absolute top-4 right-5 text-red-600 hover:text-white" onClick={clickFunction}>
          X
        </button>
        <div className='items-center flex flex-row space-x-5'>
          <img src={imageSource} className='h-full w-2/4 shadow-black shadow-sm'/>
          <p className='text-white p-2 w-1/2 justify-center'>
            {text}
          </p>
        </div> 
      </div>
      
    </Html>
  )
}

// 'bg-black border-2 items-center flex flex-row m-2 p-10 h-[30rem] w-[50rem] space-x-5'



export default ContentBox