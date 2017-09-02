package com.hacc2017

public class hello {
    String statement;
	public static hello(String statement) {
	    this.statement = "I heard you say " + statement;   
	}
	
	public static String repeatBack(){
		return statement;
	}

}