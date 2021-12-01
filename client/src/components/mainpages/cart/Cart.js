import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import swal from 'sweetalert'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)
    
    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)
            setTotal(total)
        }
        getTotal()
    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }

    {/*const removeProduct = id =>{
        if(window.confirm("Do you want to delete this product?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }*/}

    
    const removeProduct = id =>{
        swal({
            title: "Are you sure?",
            text: "Do you want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                cart.forEach((item, index) => {
                    if(item._id === id){
                        cart.splice(index, 1)
                    }
                });
              swal("Your product has been deleted!", {
                icon: "success",
              });
            }
            else{
                swal("The product was not deleted!");
            }

            setCart([...cart])
            addToCart(cart)
        
        });
    }

    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "2rem"}}>Your Saved Products List is empty!</h2> 

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" />

                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <h3>Best Price: Rs {product.price}</h3>
                            <p>{product.description}</p>
                            <h3>Available Local Business To Purchase From:
                            <li><a href='#'>{product.content}</a></li>
                        </h3>

                            
                            
                            <div className="delete" 
                            onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Cart
