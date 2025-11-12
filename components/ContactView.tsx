
import React, { useState } from 'react';
import { ContactContent } from '../types';

interface ContactViewProps {
  content: ContactContent;
}

const ContactView: React.FC<ContactViewProps> = ({ content }) => {
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, phone, message } = formState;
        
        if (!content.whatsapp_number) {
            alert("The contact number is not configured. Please try again later.");
            return;
        }

        const fullMessage = `Inquiry from ShraddhaYatra Website:\n\n*Name:* ${name}\n*Phone:* ${phone}\n\n*Message:*\n${message}`;
        const encodedMessage = encodeURIComponent(fullMessage);
        
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${content.whatsapp_number}&text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset form after submission
        setFormState({ name: '', phone: '', message: '' });
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
                <div className="divide-y-2 divide-gray-200">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-amber-900">Get in touch</h2>
                            <p className="mt-4 text-lg text-gray-500">We would love to hear from you. Fill out the form to send us a message directly on WhatsApp, and our team will get back to you shortly.</p>
                             <div className="mt-8 space-y-4 text-gray-600">
                                <p><strong>Address:</strong> {content.address}</p>
                                <p><strong>Phone:</strong> {content.phone}</p>
                                <p><strong>Email:</strong> {content.email}</p>
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-0 lg:col-span-2">
                            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="mt-1">
                                        <input type="text" name="name" id="name" required value={formState.name} onChange={handleChange} className="py-3 px-4 block w-full shadow-sm rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Your Phone Number</label>
                                    <div className="mt-1">
                                        <input type="tel" name="phone" id="phone" required value={formState.phone} onChange={handleChange} className="py-3 px-4 block w-full shadow-sm rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <div className="mt-1">
                                        <textarea id="message" name="message" rows={4} required value={formState.message} onChange={handleChange} className="py-3 px-4 block w-full shadow-sm rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"></textarea>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button type="submit" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                        Send Message via WhatsApp
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactView;