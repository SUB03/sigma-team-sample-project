import { Link } from 'react-router-dom'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="text-white mt-5" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                animation: 'rotate 30s linear infinite',
                pointerEvents: 'none'
            }}></div>
            <div className="container py-5" style={{ position: 'relative', zIndex: 10 }}>
                <div className="row g-4">
                    {/* About company */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="mb-3 fw-bold" style={{ color: 'white', fontSize: '1.5rem' }}>
                            🎓 Sigma Learning
                        </h5>
                        <p className="text-white-50" style={{ lineHeight: '1.8' }}>
                            Platform for online programming education. 
                            Gain the skills to start your IT career.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="text-white d-flex align-items-center justify-content-center" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}>
                                <i className="bi bi-twitter" style={{ fontSize: '1.2rem' }}>🐦</i>
                            </a>
                            <a href="#" className="text-white d-flex align-items-center justify-content-center" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}>
                                <i className="bi bi-facebook" style={{ fontSize: '1.2rem' }}>📘</i>
                            </a>
                            <a href="#" className="text-white d-flex align-items-center justify-content-center" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}>
                                <i className="bi bi-instagram" style={{ fontSize: '1.2rem' }}>📷</i>
                            </a>
                            <a href="#" className="text-white d-flex align-items-center justify-content-center" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}>
                                <i className="bi bi-linkedin" style={{ fontSize: '1.2rem' }}>💼</i>
                            </a>
                        </div>
                    </div>

                    {/* Courses */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="mb-3" style={{ color: 'white' }}>Courses</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/results?categories=Web" className="text-white-50 text-decoration-none">
                                    Web Development
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/results?categories=Mobile" className="text-white-50 text-decoration-none">
                                    Mobile Development
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/results?categories=Data" className="text-white-50 text-decoration-none">
                                    Data Science
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/results?categories=DevOps" className="text-white-50 text-decoration-none">
                                    DevOps
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="mb-3" style={{ color: 'white' }}>Company</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">About Us</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Careers</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Blog</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="mb-3" style={{ color: 'white' }}>Support</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Help</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">FAQ</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Terms</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none">Privacy</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-lg-2 col-md-12">
                        <h6 className="mb-3" style={{ color: 'white' }}>Newsletter</h6>
                        <p className="text-white-50 small">
                            Get news about new courses and promotions
                        </p>
                        <form className="mt-3">
                            <div className="input-group input-group-sm">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Email"
                                />
                                <button className="btn btn-primary" type="submit">
                                    →
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <hr className="my-4 border-secondary" />

                <div className="row">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="text-white-50 mb-0">
                            © {currentYear} Sigma Learning. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="text-white-50 mb-0">
                            Made with ❤️ for students
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
