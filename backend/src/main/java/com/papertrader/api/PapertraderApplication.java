package com.papertrader.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages={"com.papertrader.api.rest"})
public class PapertraderApplication {

	public static void main(String[] args) {
		SpringApplication.run(PapertraderApplication.class, args);
	}

}
