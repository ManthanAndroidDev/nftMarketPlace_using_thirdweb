import { useAddress, useMetamask, useNFTCollection } from "@thirdweb-dev/react";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Loading from "../components/Loading";

const style = {
  Wrapper: `flex flex-col justify-top items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
  form: ` flex flex-col justify-center items-left py-[50px]`,
};

const Create = () => {
  const address = useAddress();
  const connectUsingMetamask = useMetamask();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const collection = useNFTCollection(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
  );
  const onChangeFile = (e) => {
    setImage(e.target.files[0]);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await axios.post("/api/generate", { name, description, image });

    const { signature } = res.data;

    await collection.signature.mint(signature);

    alert("NFT Minted successfully!");
    setDescription("");
    setImage("");
    setName("");
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className={style.Wrapper}>
        {address ? (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div>
                <form className={style.form} onSubmit={onSubmit}>
                  <div className='py-[15px] flex justify-between'>
                    Image URL:
                    {/* <div class='rounded-[5px] flex items-center justify-center w-full py-[15px]'>
                      <label class='flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300'>
                        <div class='flex flex-col items-center justify-center pt-7'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            class='w-8 h-8 text-gray-400 group-hover:text-gray-600'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                            />
                          </svg>
                          <p class='pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600'>
                            Attach a file
                          </p>
                        </div>
                        <input type='file' onChange={onChangeFile} />
                      </label>
                    </div> */}
                    <input
                      type='text'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>
                  <div className='py-[15px] flex justify-between'>
                    Name:{" "}
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>
                  <div className='py-[15px]'>
                    Description:{" "}
                    <input
                      type='text'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>

                  <div className='w-[100%] flex justify-center '>
                    <div className='rounded-[5px] w-[50%] flex justify-center py-[5px] bg-[#0062ff]'>
                      <button type='submit' disabled={loading}>
                        Mint NFT
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <button onClick={connectUsingMetamask}>Connect using Metamask</button>
        )}
      </div>
    </>
  );
};
export default Create;
