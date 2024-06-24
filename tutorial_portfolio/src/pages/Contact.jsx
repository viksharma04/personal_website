import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import Fox from '../models/Fox';
import Loader from '../components/Loader';

const Contact = () => {
  const [form, setForm] = useState({name:'', email:'', message:''});
  const [isLoading, setisLoading] = useState(false);
  const [currentAnimation, setcurrentAnimation] = useState('idle')
  const forRef = useRef(null);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value })
  };

  const handleFocus = () => setcurrentAnimation('walk');
  const handleBlur = () => setcurrentAnimation('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    setcurrentAnimation('hit');
    emailjs.send(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        to_name: 'Vik',
        from_email: form.email,
        to_email: 'saatsdutt@gmail.com',
        message: form.message
      },
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setisLoading(false);
      setTimeout(() => {
        setForm({name:'', email:'', message:''});
        setcurrentAnimation('idle')
      }, [3000])
      
      // TODO: Show success message
      // TODO: Hide the alert
    }).catch((error) => {
      setisLoading(false);
      setcurrentAnimation('idle');
      console.log(error);
      // TODO: Show error message
    })
  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>Get in touch</h1>
        <form 
          className='w-full flex flex-col gap-7 mt-14'
          onSubmit={handleSubmit}
        >
          <label className="text-black-500 font-semibold">
            Name
            <input 
              type='text'
              name='name'
              className='input'
              placeholder='You'
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Email
            <input 
              type='email'
              name='email'
              className='input'
              placeholder='you@gmail.com'
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Name
            <textarea
              name='message'
              className='input'
              placeholder='Let me know how I can help you!'
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className='btn'
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>

        </form>
      </div>
      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov:75,
            near:0.1,
            far:1000
          }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight intensity={2} position={[0,0,1]} />
            <ambientLight intensity={1} />
            <Fox 
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.6, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>

    </section>
  )
}

export default Contact