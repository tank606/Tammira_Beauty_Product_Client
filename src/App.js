import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [listOfSellers, setListOfSellers] = useState([]);

  const [prodName, setprodName] = useState("");
  const [price, setPrice] = useState(0);
  const [prodSeller, setprodSeller] = useState("");
  const [listOfProducts, setListOfProducts] = useState([]);

  const [selectSeller, setselectSeller] = useState("");


  const addSeller = () => {
    Axios.post("http://localhost:3001/addseller", {
      name: name,
      age: age,
    })
    .then((response) => {
      // update new user for local machine
      setListOfSellers([
        ...listOfSellers,
        { _id: response.data._id, name: name, age: age },
      ]);
    })
  };

  const addProduct = () => {
    Axios.post("http://localhost:3001/addproduct", {
      name: prodName,
      price: price,
      sellerName: prodSeller,
    })
    .then((response) => {
      // update new user for local machine
      if (selectSeller == response.data.sellerName) {
        setListOfProducts([
          ...listOfProducts,
          { _id: response.data._id, name: prodName, price: price, sellerName: prodSeller},
        ]);
      }
      alert("ProductName:" + prodName + "  " + "PriceName:" + price + "  " + "Seller:" + prodSeller);
    })
    .catch(() =>{
      alert("does not work");
    })
  };

  const updateSeller = (id) => {
    const newAge = prompt("Enter new age: ");
    if (newAge) {
      Axios.put('http://localhost:3001/update', { newAge: newAge, id: id}).then(() => {
        setListOfSellers(listOfSellers.map((val) => {
          return val._id == id ? {_id: id, name: val.name, age: newAge} : val;  
        }))
      });
    }
  }

  const updateProduct = (id) => {
    const newPrice = prompt("Enter new price: ");
    const newProdSeller = prompt("Enter new Seller: ");
    if (newProdSeller && newPrice) {
      Axios.put('http://localhost:3001/updateproduct', { newSellerName: newProdSeller, newPrice: newPrice, id: id}).then(() => {
        displayProduct(selectSeller);
      });
    }
  }

  const deleteSeller = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setListOfSellers(listOfSellers.filter((val) => {
        return val._id != id;
      }));
      setListOfProducts([]);
    });
  }

  const deleteProduct = (id) => {
    Axios.delete(`http://localhost:3001/deleteproduct/${id}`).then(() => {
      setListOfProducts(listOfProducts.filter((val) => {
        return val._id != id;
      }))
    });
  }

  const displayProduct = (sellerName) => {
    // use readproduct
    setselectSeller(sellerName);
    Axios.get(`http://localhost:3001/displayproduct/${sellerName}`)
      .then((response) => {
        setListOfProducts(response.data);
        
      })
      .catch(() => {
        console.log("ERR");
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/read")
      .then((response) => {
        // console.log(response);
        setListOfSellers(response.data);
      })
      .catch(() => {
        console.log("ERR");
      });
  }, []); 

  return (
    <div className="App">
      <div className="inputlayout">
        <div className="inputs">
          <input
              type="text"
              placeholder="Seller name..."
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Seller age..."
              onChange={(event) => {
                setAge(event.target.value);
              }}
            />
            <button onClick={addSeller}>Add Seller</button>
        </div>
        <div className="inputs">
            <input
              type="text"
              placeholder="Product name..."
              onChange={(event) => {
                setprodName(event.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Price"
              onChange={(event) => {
                setPrice(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="which Seller"
              onChange={(event) => {
                setprodSeller(event.target.value);
              }}
            />
            <button onClick={addProduct}>Add Product</button>
        </div>
      </div>
      


      <div className="inputlayout">
        <div className="listOfSellers">
          {listOfSellers.map((val) => {
            return (
            <div className="sellerContainer">
              <div className="seller">
                  <h3>Seller Name: {val.name}</h3>
                  <h3> Age: {val.age}</h3>
              </div>
              <button onClick={() => {
                updateSeller(val._id);
              }}>
              Update
              </button>
              <button  id="removeBtn" onClick={() => {
                deleteSeller(val._id);
              }}>
              X
              </button>
              <button  id={val.name == selectSeller? "changeColorBtn":"removeBtn" }
              onClick={() => {
                displayProduct(val.name);
              }}>
              Product
              </button>
            </div>
            );
          })}
        </div>

        {
        listOfProducts.length != 0 && 
        <div className="listOfSellers">
          {listOfProducts.map((val) => {
            return (
            <div className="sellerContainer">
              <div className="seller">
                  <h3>Product Name: {val.name}</h3>
                  <h3> Price: {val.price}</h3>
                  <h3>SellerName: {val.sellerName}</h3>
              </div>
              <button onClick={() => {
                updateProduct(val._id);
              }}>
              Update
              </button>
              <button  id="removeBtn" onClick={() => {
                deleteProduct(val._id);
              }}>
              X
              </button>
            </div>
            );
          })}
        </div>
        }
      </div>
      

    </div>
  );
}

export default App;
