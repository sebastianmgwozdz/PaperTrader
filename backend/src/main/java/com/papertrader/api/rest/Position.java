package com.papertrader.api.rest;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "Positions")
@EntityListeners(AuditingEntityListener.class)
public class Position {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idPositions;
	
	private String userId;
	private String ticker;
	private int price;
	private int initial;
	private int remaining;
	private boolean isLong;
	private Date openDate;
	private Date closeDate;
	
	
	
	public int getIdPositions() {
		return idPositions;
	}

	public String getUserId() {
		return userId;
	}
	
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	public String getTicker() {
		return ticker;
	}
	
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	
	public int getPrice() {
		return price;
	}
	
	public void setPrice(int price) {
		this.price = price;
	}
	
	public int getInitial() {
		return initial;
	}
	
	public void setInitial(int initial) {
		this.initial = initial;
	}
	
	public int getRemaining() {
		return remaining;
	}
	
	public void setRemaining(int remaining) {
		this.remaining = remaining;
	}
	
	public boolean getIsLong() {
		return isLong;
	}
	
	public void setIsLong(boolean isLong) {
		this.isLong = isLong;
	}
	
	public Date getOpenDate() {
		return openDate;
	}
	
	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}
	
	public Date getCloseDate() {
		return closeDate;
	}
	
	public void setCloseDate(Date closeDate) {
		this.closeDate = closeDate;
	}
	
	
	
	

}
