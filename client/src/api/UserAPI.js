import { useState, useEffect } from 'react'
import axios from 'axios'
import swal from 'sweetalert'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    })

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)

                } catch (err) {
                    swal(err.response.data.msg)
                }
            }

            getUser()

        }
    }, [token])



    const addCart = async (product) => {
        if (!isLogged) return swal("Please Log In First","You're not logged in :-(")

        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])

            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })

        } else {
            swal("Product saved!", "This product has been added to your Saved Products List.", "success")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
    }
}

export default UserAPI
