import React from 'react'

const ProductLoader = () => {
    return (
        <div className="text-center my-5 product-loader">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default ProductLoader