package com.hacc2017

public class hello {
    String statement;
	public hello(String statement) {
	    this.statement = "I heard you say " + statement;   
	}
	
	public String repeatBack(){
		return statement;
	}

}