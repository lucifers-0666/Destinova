import React, { useEffect, useMemo, useRef, useState } from 'react';

// Icons using Font Awesome classes; swap to Lucide if preferred
const Icon = ({ name, className = '' }) => (
  <i className={`fa ${name} ${className}`.trim()} aria-hidden="true" />
);

export default function DestinovaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [attempted, setAttempted] = useState(false);

  const emailValid = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email), [email]);
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-zA-Z]/.test(password) && /\d/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    return s; // 0-3
  }, [password]);

  const emailError = attempted || touched.email ? (!email ? 'Please enter your email address' : !emailValid ? 'Please enter a valid email address' : '') : '';
  const passwordError = attempted || touched.password ? (!password ? 'Please enter your password' : '') : '';

  function onSubmit(e) {
    e.preventDefault();
    setAttempted(true);
    if (!email || !emailValid || !password) return;

    setSubmitting(true);
    // Simulate API
    setTimeout(() => {
      setSubmitting(false);
      alert('Sign in successful!');
    }, 1500);
  }

  // Parallax
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    function onMove(e) {
      const x = (e.clientX - window.innerWidth / 2) / 80;
      const y = (e.clientY - window.innerHeight / 2) / 80;
      el.style.setProperty('--parallax-x', `${x}px`);
      el.style.setProperty('--parallax-y', `${y}px`);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const strengthBar = [
    { width: '33%', color: 'bg-red-500', text: 'Weak' },
    { width: '66%', color: 'bg-yellow-500', text: 'Medium' },
    { width: '100%', color: 'bg-green-600', text: 'Strong' },
  ][Math.max(0, passwordStrength - 1)] || { width: '0%', color: 'bg-transparent', text: '' };

  return (
    <div className="min-h-screen w-full font-inter bg-white">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative lg:w-[60%] h-[30vh] lg:h-auto overflow-hidden"
          style={{
            background: `
              linear-gradient(135deg, rgba(45, 95, 63, 0.85) 0%, rgba(31, 68, 48, 0.9) 100%),
              url('../site-images/FC-P1.webp') center/cover no-repeat,
              url('../site-images/FC-P2.webp') center/cover no-repeat
            `,
            backgroundBlendMode: 'overlay, normal, overlay',
          }}
        >
          {/* Enhanced Background Overlay */}
          <div className="absolute inset-0" style={{
            background: `
              url('../site-images/BC-P1.webp') right center/30% no-repeat,
              url('../site-images/PEC-P1.webp') left center/25% no-repeat,
              radial-gradient(circle at 30% 40%, rgba(184, 212, 195, 0.1) 0%, transparent 60%)
            `,
            backgroundBlendMode: 'overlay, overlay, normal',
            opacity: 0.6,
            transform: 'translate3d(var(--parallax-x,0), var(--parallax-y,0), 0)'
          }} />
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div 
              className="absolute top-10 right-1/3 w-20 h-20 rounded-full"
              style={{
                backgroundImage: "url('../site-images/BC-P2.jpg')",
                backgroundSize: 'cover',
                animation: 'float 60s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute bottom-1/4 left-10 w-16 h-16 rounded-full"
              style={{
                backgroundImage: "url('../site-images/PEC-P2.jpg')",
                backgroundSize: 'cover',
                animation: 'float 45s ease-in-out infinite reverse'
              }}
            />
          </div>

          <div className="relative z-10 h-full px-6 lg:px-16 py-10 flex flex-col justify-center text-white">
            <div className="flex items-center gap-3 mb-8">
              <i className="fas fa-dove text-white text-2xl" />
              <span className="text-white text-2xl font-bold" style={{ height: 32, lineHeight: '32px' }}>Destinova</span>
            </div>

            <h1 className="text-[56px] leading-[1.2] font-bold hidden lg:block">Fly Beyond Limits.</h1>
            <h2 className="text-[52px] leading-[1.2] font-light text-[#b8d4c3] hidden lg:block mb-6">Travel with Confidence.</h2>
            <p className="text-[18px] leading-[1.7] text-white/90 max-w-[520px] hidden lg:block mb-10">
              Book smarter with AI-powered price predictions, instant refunds, and 24/7 concierge support. Your next adventure starts here.
            </p>

            <div className="hidden lg:flex items-center gap-4 mb-8">
              {[
                ['lock', '256-bit Encryption'],
                ['headset', '24/7 Support'],
                ['tags', 'Price Match']
              ].map(([icon, text]) => (
                <div key={text} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 flex items-center gap-3">
                  <i className={`fas fa-${icon} text-white text-lg`} />
                  <span className="text-white text-base font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:block text-sm text-white/75">
              <div className="inline-flex items-center gap-2">
                <span className="text-yellow-400 text-base">★★★★★</span>
                <span className="font-medium">4.8 on Trustpilot</span>
                <span className="mx-2">•</span>
                <span className="font-medium">2M+ travelers</span>
              </div>
            </div>

            {/* Savings badge */}
            <div className="hidden lg:block absolute bottom-8 right-8 bg-gradient-to-br from-green-700 to-green-600 text-white rounded-xl px-5 py-4 shadow-xl animate-pulse">
              <div className="flex items-center gap-3">
                <i className="fas fa-tag" />
                <div>
                  <p className="text-sm font-semibold">Save up to ₹30,000</p>
                  <p className="text-xs opacity-90">on your next flight</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login */}
        <section className="lg:w-[40%] relative overflow-hidden flex items-center justify-center py-10 px-6 lg:px-12" style={{
          background: `
            linear-gradient(135deg, #f8f9f5 0%, #f3f4f0 100%),
            url('../site-images/EC-P1.jpg')
          `,
          backgroundSize: 'cover, cover',
          backgroundBlendMode: 'normal, overlay'
        }}>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div 
              className="absolute top-10 right-10 w-32 h-32 rounded-full"
              style={{
                backgroundImage: "url('../site-images/card1_ps.jpg')",
                backgroundSize: 'cover',
                animation: 'float 70s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute bottom-20 left-10 w-24 h-24 rounded-full"
              style={{
                backgroundImage: "url('../site-images/des_pg_crd4.jpg')",
                backgroundSize: 'cover',
                animation: 'float 90s ease-in-out infinite reverse'
              }}
            />
          </div>
          
          <div className="w-full max-w-[420px] bg-white rounded-[20px] p-[40px_32px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative z-10">
            <header className="text-center mb-6">
              <h2 className="text-[36px] font-bold text-[#1a1a1a] mb-2">Welcome Back</h2>
              <p className="text-[16px] text-[#666]">Sign in to continue your journey</p>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-[14px] mt-6">
                <i className="fas fa-check-circle" />
                <span>Join 2.4M travelers who saved 30% on average</span>
              </div>
            </header>

            <form onSubmit={onSubmit} noValidate>
              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-[14px] font-medium text-[#1a1a1a] mb-2">Email Address</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-[20px]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full h-[54px] pl-12 pr-4 text-[14px] border-2 rounded-[12px] placeholder:text-[#999] outline-none transition-all duration-300 
                    ${emailError ? 'border-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.1)]' : 'border-[#e0e0e0] focus:border-[#2d5f3f] focus:shadow-[0_0_0_4px_rgba(45,95,63,0.1)]'}`}
                  />
                </div>
                {!!emailError && (
                  <p className="mt-2 text-[12px] text-red-600 flex items-center gap-2"><i className="fas fa-exclamation-circle" />{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-[14px] font-medium text-[#1a1a1a] mb-2">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-[20px]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full h-[54px] pl-12 pr-12 text-[14px] border-2 rounded-[12px] placeholder:text-[#999] outline-none transition-all duration-300 
                    ${passwordError ? 'border-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.1)]' : 'border-[#e0e0e0] focus:border-[#2d5f3f] focus:shadow-[0_0_0_4px_rgba(45,95,63,0.1)]'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] w-6 h-6 flex items-center justify-center"
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[18px]`} />
                  </button>
                </div>

                {/* Strength */}
                <div className="mt-2">
                  <div className="h-[4px] w-full bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strengthBar.color}`} style={{ width: strengthBar.width }} />
                  </div>
                  <p className="text-[12px] text-[#666] mt-1">Use 8+ characters with letters and numbers</p>
                  {!!strengthBar.text && <div className={`text-[12px] mt-1 font-medium ${strengthBar.color.replace('bg-','text-')}`}>{strengthBar.text}</div>}
                </div>
                {!!passwordError && (
                  <p className="mt-2 text-[12px] text-red-600 flex items-center gap-2"><i className="fas fa-exclamation-circle" />{passwordError}</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-[4px] accent-[#2d5f3f]" />
                  <span className="text-[14px] text-[#666]">Remember me</span>
                </label>
                <a href="#" className="text-[14px] text-[#2d5f3f] hover:underline">Forgot password?</a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full h-[54px] rounded-[12px] text-white text-[16px] font-medium transition-all duration-300 flex items-center justify-center gap-2 
                ${submitting ? 'opacity-70' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,95,63,0.3)]'} bg-gradient-to-r from-[#2d5f3f] to-[#1f4430]`}
              >
                {submitting ? 'Signing you in...' : 'Sign In'}
                {!submitting && <span className="text-lg">→</span>}
                {submitting && <span className="ml-2 inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e0e0e0]" />
              </div>
              <div className="relative flex justify-center text-[14px]">
                <span className="px-4 bg-white text-[#666]">Or continue with</span>
              </div>
            </div>

            {/* Socials */}
            <div className="grid grid-cols-3 gap-3">
              {[['google','text-red-500','hover:border-red-500'],['facebook','text-blue-600','hover:border-blue-600'],['apple','text-gray-800','hover:border-gray-800']].map(([brand, color, hover]) => (
                <button key={brand} className={`h-[52px] border-2 border-[#e0e0e0] rounded-[12px] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${hover}`}>
                  <i className={`fab fa-${brand} text-[24px] ${color}`} />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-[12px] text-[#666]"><i className="fas fa-lock mr-1" />Your data is encrypted and secure</p>
              <p className="text-[12px] text-[#666] mt-3">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#" className="hover:underline">Terms of Service</a>
              </p>
              <p className="text-[14px] text-[#666] mt-4">Don't have an account?
                <a href="#" className="ml-1 font-semibold text-[#2d5f3f] hover:underline">Sign up</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
