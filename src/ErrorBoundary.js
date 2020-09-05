import React, { Component } from 'react'

export default class ErrorBoundary extends Component{
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
      }

    render() {
        if (this.state.hasError) {      
            return (
            <h2>Could not display this screen. Please try again.</h2>
            );
        }
        return this.props.children;
    } 
}