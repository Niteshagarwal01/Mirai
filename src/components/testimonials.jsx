import React from 'react'

const testimonials = () => {
    return (
    <div>
    <section id="testimonials" className="testimonials">
        <div className="container">
            <div className="section-header">
                <h2>Client <span className="gradient-text">Testimonials</span></h2>
                <p>Hear from businesses that have transformed their marketing with Mirai</p>
            </div>
            <div className="testimonial-grid">
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <p className="testimonial-text">"Mirai has completely transformed our marketing operations. We've seen a 300% increase in engagement and our team is saving 25 hours per week on routine marketing tasks."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Emily Johnson" className="avatar"/>
                        <div className="author-info">
                            <h4>Emily Johnson</h4>
                            <p>Marketing Director, Falcon Technologies</p>
                        </div>
                    </div>
                </div>
                
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <p className="testimonial-text">"The AI product photoshoot feature alone is worth the investment. We've cut our product photography budget by 70% while producing more visually appealing content."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Michael Chen" className="avatar"/>
                        <div className="author-info">
                            <h4>Michael Chen</h4>
                            <p>E-commerce Manager, StyleHub</p>
                        </div>
                    </div>
                </div>
                
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                    </div>
                    <p className="testimonial-text">"Our sales team has been completely reenergized thanks to Mirai's voice sales agent. We're now able to follow up with every lead and our conversion rates have increased by 45%."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Sarah Thompson" className="avatar"/>
                        <div className="author-info">
                            <h4>Sarah Thompson</h4>
                            <p>Sales Director, Quantum Solutions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="blur-gradient left"></div>
        <div className="blur-gradient right"></div>
    </section> 
    </div>
    )
}

export default testimonials
